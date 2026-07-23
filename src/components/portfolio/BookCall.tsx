import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { Calendar } from "@/components/ui/calendar";
import { createDiscoveryOrder } from "@/lib/razorpay.functions";
import { getAvailableSlots, createConfirmedBooking } from "@/lib/bookings.functions";

type RzpResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RzpOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  theme?: { color?: string };
  prefill?: { name?: string; email?: string };
  handler: (r: RzpResponse) => void;
  modal?: { ondismiss?: () => void };
};
declare global {
  interface Window {
    Razorpay?: new (opts: RzpOptions) => { open: () => void };
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

function loadRzp() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type Slot = { startISO: string; endISO: string; label: string };

function formatDateIST(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatSlotIST(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function BookCall() {
  const [step, setStep] = useState<"pick" | "form" | "paying" | "done" | "error">("pick");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [form, setForm] = useState({ name: "", email: "", notes: "" });
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ startISO: string; hasCalendarInvite: boolean } | null>(null);
  const [devSkip, setDevSkip] = useState(false);

  const createOrder = useServerFn(createDiscoveryOrder);
  const fetchSlots = useServerFn(getAvailableSlots);
  const confirmBooking = useServerFn(createConfirmedBooking);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDevSkip(new URLSearchParams(window.location.search).has("devskip"));
  }, []);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    const key = formatDateIST(date);
    setSlotsLoading(true);
    setSelectedSlot(null);
    fetchSlots({ data: { date: key } })
      .then((r) => setSlots(r.slots))
      .catch((e) => {
        console.error(e);
        setError(e instanceof Error ? e.message : "Could not load slots");
      })
      .finally(() => setSlotsLoading(false));
  }, [date, fetchSlots]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d;
  }, []);

  const finalize = async (paymentIds: { orderId: string; paymentId: string; signature: string }) => {
    if (!selectedSlot) throw new Error("No slot selected");
    const res = await confirmBooking({
      data: {
        ...paymentIds,
        name: form.name,
        email: form.email,
        notes: form.notes,
        startISO: selectedSlot.startISO,
        endISO: selectedSlot.endISO,
      },
    });
    setConfirmed({ startISO: res.startISO, hasCalendarInvite: res.hasCalendarInvite });
    setStep("done");
  };

  const onPay = async () => {
    setError(null);
    if (!selectedSlot) return setError("Pick a time slot first.");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email are required.");
    setStep("paying");
    try {
      const ok = await loadRzp();
      if (!ok || !window.Razorpay) throw new Error("Razorpay could not load");
      const order = await createOrder();
      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Amir Khan · Discovery Call",
        description: "30-min discovery call, fee credited if we work together.",
        theme: { color: "#fbbf24" },
        prefill: { name: form.name, email: form.email },
        handler: async (r) => {
          try {
            await finalize({
              orderId: r.razorpay_order_id,
              paymentId: r.razorpay_payment_id,
              signature: r.razorpay_signature,
            });
          } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : "Could not confirm booking");
            setStep("error");
          }
        },
        modal: { ondismiss: () => setStep("form") },
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStep("error");
    }
  };

  const onDevSkip = async () => {
    setError(null);
    if (!selectedSlot) return setError("Pick a time slot first.");
    if (!form.name.trim() || !form.email.trim()) return setError("Name and email required.");
    setStep("paying");
    try {
      await finalize({
        orderId: `dev_${Date.now()}`,
        paymentId: `pay_dev_${Date.now()}`,
        signature: "dev",
      });
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Booking failed");
      setStep("error");
    }
  };

  return (
    <section id="book" className="border-t border-border px-6 py-32 md:px-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            [08] Direct Line
          </p>
          <h2 className="mb-4 font-display text-5xl uppercase md:text-7xl">
            Book a discovery call
          </h2>
          <p className="mb-12 max-w-xl text-lg text-muted">
            30 minutes, 1:1. Bring the messy version of the problem. Fee filters for
            serious founders and is credited back if we end up working together.
          </p>
        </Reveal>

        {step === "done" && confirmed ? (
          <Reveal>
            <div className="border border-accent/30 bg-accent/[0.03] p-8 md:p-12 text-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent mb-4">
                Booking confirmed
              </p>
              <h3 className="font-display text-4xl uppercase mb-4">
                See you on {formatSlotIST(confirmed.startISO)} IST
              </h3>
              <p className="max-w-xl mx-auto text-lg text-muted">
                {confirmed.hasCalendarInvite
                  ? "A Google Calendar invite with the Meet link is on its way to your inbox."
                  : "You will receive a confirmation email shortly."}
              </p>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.1}>
            <div className="grid gap-8 border border-border bg-white/[0.015] p-6 md:p-10 lg:grid-cols-[auto_1fr]">
              <div>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                  [1] Pick a date · IST
                </div>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={{ before: today, after: maxDate }}
                  className="border border-border p-3"
                />
                <div className="mt-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    Fee
                  </div>
                  <div className="mt-2 font-display text-5xl uppercase">
                    ₹149 <span className="text-sm text-muted">INR</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                    Razorpay · UPI · Cards · Netbanking
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    [2] Pick a time · 30 min
                  </div>
                  {!date ? (
                    <p className="text-muted">Select a date to see open slots.</p>
                  ) : slotsLoading ? (
                    <p className="text-muted">Checking availability...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-muted">No slots left on this day. Try another date.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                      {slots.map((s) => {
                        const active = selectedSlot?.startISO === s.startISO;
                        return (
                          <button
                            key={s.startISO}
                            onClick={() => setSelectedSlot(s)}
                            className={
                              "border px-3 py-2 font-mono text-xs tracking-widest transition-colors " +
                              (active
                                ? "border-accent bg-accent text-bg"
                                : "border-border text-white hover:border-accent hover:text-accent")
                            }
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    [3] Your details
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                    />
                    <textarea
                      placeholder="What do you want to talk about? (optional)"
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      className="min-h-24 sm:col-span-2 border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    {selectedSlot
                      ? `Selected: ${formatSlotIST(selectedSlot.startISO)} IST`
                      : "No slot selected"}
                  </div>
                  <MagneticButton
                    onClick={onPay}
                    className="bg-accent px-10 py-5 font-display text-xl uppercase tracking-widest text-bg disabled:opacity-40"
                  >
                    {step === "paying" ? "Processing..." : "Pay & confirm"}
                  </MagneticButton>
                </div>

                {devSkip && (
                  <div className="flex items-center justify-between border border-accent/30 bg-accent/[0.04] px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                      Dev bypass active
                    </span>
                    <button
                      onClick={onDevSkip}
                      className="font-mono text-[10px] uppercase tracking-widest text-accent underline underline-offset-4"
                    >
                      Skip payment, confirm booking
                    </button>
                  </div>
                )}

                {error && (
                  <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}