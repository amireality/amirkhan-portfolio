import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { createDiscoveryOrder, verifyDiscoveryPayment } from "@/lib/razorpay.functions";

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
  }
}

const CALENDLY_URL =
  (import.meta.env.VITE_CALENDLY_URL as string | undefined) ??
  "https://calendly.com/amirkhan-setupr/discovery-call";

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

export function BookCall() {
  const [status, setStatus] = useState<"idle" | "loading" | "paid" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const createOrder = useServerFn(createDiscoveryOrder);
  const verifyPayment = useServerFn(verifyDiscoveryPayment);

  useEffect(() => {
    if (status !== "paid") return;
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    document.body.appendChild(s);
  }, [status]);

  const onPay = async () => {
    setError(null);
    setStatus("loading");
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
        description: "30-min working call, fee credited if we work together.",
        theme: { color: "#fbbf24" },
        handler: async (r) => {
          const { ok } = await verifyPayment({
            data: {
              orderId: r.razorpay_order_id,
              paymentId: r.razorpay_payment_id,
              signature: r.razorpay_signature,
            },
          });
          if (ok) setStatus("paid");
          else {
            setError("Payment verification failed. Contact me directly.");
            setStatus("error");
          }
        },
        modal: { ondismiss: () => setStatus("idle") },
      });
      rzp.open();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  };

  return (
    <section id="book" className="border-t border-border px-6 py-32 md:px-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            [09] Direct Line
          </p>
          <h2 className="mb-4 font-display text-5xl uppercase md:text-7xl">
            Book a discovery call
          </h2>
          <p className="mb-12 max-w-xl text-lg text-muted">
            30 minutes, 1:1. Bring the messy version of the problem. Fee filters for
            serious founders and is credited back if we end up working together.
          </p>
        </Reveal>

        {status !== "paid" ? (
          <Reveal delay={0.1}>
            <div className="border border-border bg-white/[0.015] p-8 md:p-12">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
                    Fee
                  </div>
                  <div className="mt-2 font-display text-6xl uppercase">
                    ₹149 <span className="text-lg text-muted">INR</span>
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                    Secured by Razorpay · UPI · Cards · Netbanking
                  </div>
                </div>
                <MagneticButton
                  onClick={onPay}
                  className="bg-accent px-10 py-5 font-display text-xl uppercase tracking-widest text-bg"
                >
                  {status === "loading" ? "Opening…" : "Pay & book slot →"}
                </MagneticButton>
              </div>
              {error && (
                <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-accent">
                  {error}
                </p>
              )}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="border border-accent/30 bg-accent/[0.03] p-6">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                Payment received, pick a slot
              </p>
              <div
                className="calendly-inline-widget"
                data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=080808&text_color=f2f2f2&primary_color=fbbf24`}
                style={{ minWidth: "320px", height: "720px" }}
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}