import { createServerFn } from "@tanstack/react-start";
import { createHmac, timingSafeEqual } from "node:crypto";

const AMOUNT_INR = 149; // ₹149 discovery call fee

export const createDiscoveryOrder = createServerFn({ method: "POST" }).handler(
  async () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys not configured");
    }
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: AMOUNT_INR * 100,
        currency: "INR",
        receipt: `disc_${Date.now()}`,
        notes: { purpose: "Discovery call — Amir Khan" },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Razorpay order failed", res.status, body);
      throw new Error(`Razorpay order failed [${res.status}]`);
    }
    const order = (await res.json()) as { id: string; amount: number; currency: string };
    return { orderId: order.id, amount: order.amount, currency: order.currency, keyId };
  },
);

export const verifyDiscoveryPayment = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { orderId: string; paymentId: string; signature: string }) => data,
  )
  .handler(async ({ data }) => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) throw new Error("Razorpay secret not configured");
    const expected = createHmac("sha256", keySecret)
      .update(`${data.orderId}|${data.paymentId}`)
      .digest("hex");
    const a = Buffer.from(expected);
    const b = Buffer.from(data.signature);
    const ok = a.length === b.length && timingSafeEqual(a, b);
    return { ok };
  });