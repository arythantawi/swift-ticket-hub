-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  pickup_address TEXT NOT NULL,
  notes TEXT,
  route_from TEXT NOT NULL,
  route_to TEXT NOT NULL,
  route_via TEXT,
  pickup_time TEXT NOT NULL,
  travel_date DATE NOT NULL,
  passengers INTEGER NOT NULL DEFAULT 1,
  total_price INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'waiting_verification', 'paid', 'cancelled')),
  payment_proof_url TEXT,
  payment_proof_drive_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can create booking)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public select by order_id (users can view their own booking by order_id)
CREATE POLICY "Anyone can view bookings by order_id" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create policy for public update payment proof
CREATE POLICY "Anyone can update payment proof" 
ON public.bookings 
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Create function to generate order ID
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_id := 'TRV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(NEW.id::text, 1, 4));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-generate order ID
CREATE TRIGGER set_order_id
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_id();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();