import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "node:crypto";

const IST_OFFSET = "+05:30";
const SLOT_MINUTES = 30;
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 22; // last slot starts at 21:30
const GATEWAY = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

function gatewayHeaders() {
  const lovable = process.env.LOVABLE_API_KEY;
  const gcal = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!lovable || !gcal) throw new Error("Google Calendar connector is not configured");
  return {
    Authorization: `Bearer ${lovable}`,
    "X-Connection-Api-Key": gcal,
    "Content-Type": "application/json",
  } as Record<string, string>;
}

function slotsForDate(dateStr: string): { startISO: string; endISO: string; label: string }[] {
  // dateStr = YYYY-MM-DD in IST
  const out: { startISO: string; endISO: string; label: string }[] = [];
  for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      const start = new Date(`${dateStr}T${hh}:${mm}:00${IST_OFFSET}`);
      const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
      out.push({
        startISO: start.toISOString(),
        endISO: end.toISOString(),
        label: `${hh}:${mm}`,
      });
    }
  }
  return out;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

async function getSupabaseAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const getAvailableSlots = createServerFn({ method: "POST" })
  .inputValidator((data: { date: string }) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error("Invalid date");
    return data;
  })
  .handler(async ({ data }) => {
    const slots = slotsForDate(data.date);
    if (slots.length === 0) return { slots: [] };

    const dayStart = new Date(slots[0].startISO);
    const dayEnd = new Date(slots[slots.length - 1].endISO);

    // Filter out slots that are already in the past (buffer 15 minutes)
    const nowPlusBuffer = new Date(Date.now() + 15 * 60_000);

    // Query DB for existing bookings that day
    const supabase = await getSupabaseAdmin();
    const { data: booked, error } = await supabase
      .from("discovery_bookings")
      .select("start_at, end_at")
      .gte("start_at", dayStart.toISOString())
      .lt("start_at", new Date(dayEnd.getTime() + 24 * 3600_000).toISOString())
      .eq("status", "confirmed");
    if (error) throw error;

    // Query Google Calendar freeBusy
    let busy: { start: string; end: string }[] = [];
    try {
      const res = await fetch(`${GATEWAY}/freeBusy`, {
        method: "POST",
        headers: gatewayHeaders(),
        body: JSON.stringify({
          timeMin: dayStart.toISOString(),
          timeMax: dayEnd.toISOString(),
          items: [{ id: "primary" }],
        }),
      });
      if (res.ok) {
        const body = (await res.json()) as {
          calendars?: { primary?: { busy?: { start: string; end: string }[] } };
        };
        busy = body.calendars?.primary?.busy ?? [];
      } else {
        console.error("freeBusy failed", res.status, await res.text());
      }
    } catch (e) {
      console.error("freeBusy error", e);
    }

    const bookedRanges = (booked ?? []).map((b) => ({
      s: new Date(b.start_at),
      e: new Date(b.end_at),
    }));
    const busyRanges = busy.map((b) => ({ s: new Date(b.start), e: new Date(b.end) }));

    const available = slots
      .filter((slot) => new Date(slot.startISO) > nowPlusBuffer)
      .filter((slot) => {
        const s = new Date(slot.startISO);
        const e = new Date(slot.endISO);
        return (
          !bookedRanges.some((r) => overlaps(s, e, r.s, r.e)) &&
          !busyRanges.some((r) => overlaps(s, e, r.s, r.e))
        );
      });

    return { slots: available };
  });

export const createConfirmedBooking = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      orderId: string;
      paymentId: string;
      signature: string;
      name: string;
      email: string;
      notes?: string;
      startISO: string;
      endISO: string;
    }) => {
      if (!data.name?.trim() || !data.email?.trim()) throw new Error("Name and email required");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) throw new Error("Invalid email");
      return data;
    },
  )
  .handler(async ({ data }) => {
    // 1. Verify Razorpay signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(data.signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new Error("Invalid payment signature");
    }

    const start = new Date(data.startISO);
    const end = new Date(data.endISO);

    // 2. Re-check availability (avoid race)
    const supabase = await getSupabaseAdmin();
    const { data: clash } = await supabase
      .from("discovery_bookings")
      .select("id")
      .lt("start_at", end.toISOString())
      .gt("end_at", start.toISOString())
      .eq("status", "confirmed")
      .limit(1);
    if (clash && clash.length > 0) {
      throw new Error("Slot was just booked by someone else. Please pick another slot.");
    }

    // 3. Create Google Calendar event (sends invite to attendee)
    let googleEventId: string | null = null;
    try {
      const res = await fetch(
        `${GATEWAY}/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1`,
        {
          method: "POST",
          headers: gatewayHeaders(),
          body: JSON.stringify({
            summary: `Discovery call: ${data.name} × Amir Khan`,
            description: [
              `Booked via amir.setupr.com`,
              `Name: ${data.name}`,
              `Email: ${data.email}`,
              data.notes ? `Notes: ${data.notes}` : null,
              `Razorpay payment: ${data.paymentId}`,
            ]
              .filter(Boolean)
              .join("\n"),
            start: { dateTime: start.toISOString(), timeZone: "Asia/Kolkata" },
            end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
            attendees: [{ email: data.email, displayName: data.name }],
            reminders: { useDefault: true },
            conferenceData: {
              createRequest: {
                requestId: `disc_${data.paymentId}`,
                conferenceSolutionKey: { type: "hangoutsMeet" },
              },
            },
          }),
        },
      );
      if (!res.ok) {
        const body = await res.text();
        console.error("GCal event create failed", res.status, body);
      } else {
        const body = (await res.json()) as { id?: string };
        googleEventId = body.id ?? null;
      }
    } catch (e) {
      console.error("GCal event error", e);
    }

    // 4. Persist booking
    const { data: inserted, error } = await supabase
      .from("discovery_bookings")
      .insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        notes: data.notes?.trim() || null,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        razorpay_order_id: data.orderId,
        razorpay_payment_id: data.paymentId,
        google_event_id: googleEventId,
        status: "confirmed",
      })
      .select("id")
      .single();
    if (error) throw error;

    return {
      ok: true,
      bookingId: inserted.id,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      hasCalendarInvite: googleEventId !== null,
    };
  });