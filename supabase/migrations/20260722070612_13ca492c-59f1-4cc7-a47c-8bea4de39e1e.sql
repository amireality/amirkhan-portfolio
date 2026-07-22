
CREATE TABLE public.discovery_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  notes text,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text,
  google_event_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.discovery_bookings TO service_role;
ALTER TABLE public.discovery_bookings ENABLE ROW LEVEL SECURITY;
CREATE INDEX discovery_bookings_start_at_idx ON public.discovery_bookings (start_at);
