CREATE TYPE public.app_role AS ENUM ('admin', 'user');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

ALTER TABLE public.profiles ADD COLUMN account_type text NOT NULL DEFAULT 'owner';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t text := coalesce(new.raw_user_meta_data->>'account_type', 'owner');
BEGIN
  IF t NOT IN ('owner', 'builder') THEN t := 'owner'; END IF;
  INSERT INTO public.profiles (id, full_name, account_type)
  VALUES (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), t)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE TABLE public.service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_no bigint GENERATED ALWAYS AS IDENTITY (START WITH 100001),
  user_id uuid NOT NULL,
  service_slug text NOT NULL,
  category text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  fee integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'awaiting_payment',
  paid boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own requests" ON public.service_requests FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own requests" ON public.service_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'awaiting_payment' AND paid = false);
CREATE POLICY "Admins update requests" ON public.service_requests FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER service_requests_updated BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.request_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  from_team boolean NOT NULL DEFAULT false,
  message text NOT NULL DEFAULT '',
  file_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.request_updates TO authenticated;
GRANT ALL ON public.request_updates TO service_role;
ALTER TABLE public.request_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read updates on own or admin" ON public.request_updates FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.service_requests r WHERE r.id = request_id AND r.user_id = auth.uid()));
CREATE POLICY "Post updates on own or admin" ON public.request_updates FOR INSERT TO authenticated WITH CHECK (
  author_id = auth.uid() AND (
    (from_team AND public.has_role(auth.uid(), 'admin')) OR
    (NOT from_team AND EXISTS (SELECT 1 FROM public.service_requests r WHERE r.id = request_id AND r.user_id = auth.uid()))));

CREATE TABLE public.auctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  city text NOT NULL DEFAULT '',
  locality text NOT NULL DEFAULT '',
  property_type text NOT NULL DEFAULT 'Apartment',
  carpet_area integer NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  image_path text,
  reserve_price bigint NOT NULL,
  bid_step bigint NOT NULL DEFAULT 50000,
  emd_amount bigint NOT NULL DEFAULT 0,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  extension_minutes integer NOT NULL DEFAULT 5,
  balance_due_hours integer NOT NULL DEFAULT 72,
  current_price bigint NOT NULL DEFAULT 0,
  current_winner uuid,
  bid_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.auctions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auctions TO authenticated;
GRANT ALL ON public.auctions TO service_role;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published auctions are public" ON public.auctions FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert auctions" ON public.auctions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update auctions" ON public.auctions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete auctions" ON public.auctions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.auction_registrations (
  auction_id uuid NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  emd_status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (auction_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.auction_registrations TO authenticated;
GRANT ALL ON public.auction_registrations TO service_role;
ALTER TABLE public.auction_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or admin registrations" ON public.auction_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Register self" ON public.auction_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND emd_status = 'pending');
CREATE POLICY "Admins update registrations" ON public.auction_registrations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id uuid NOT NULL REFERENCES public.auctions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  amount bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bids TO anon;
GRANT SELECT ON public.bids TO authenticated;
GRANT ALL ON public.bids TO service_role;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bids are publicly visible" ON public.bids FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  kind text NOT NULL,
  ref_id uuid NOT NULL,
  amount bigint NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  provider_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or admin payments" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Create own pending payments" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admins update payments" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.place_bid(_auction uuid, _amount bigint)
RETURNS public.auctions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE a public.auctions; uid uuid := auth.uid(); min_bid bigint;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'Sign in to bid'; END IF;
  SELECT * INTO a FROM public.auctions WHERE id = _auction AND status = 'published' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Auction not found'; END IF;
  IF now() < a.starts_at THEN RAISE EXCEPTION 'Auction has not started yet'; END IF;
  IF now() > a.ends_at THEN RAISE EXCEPTION 'Auction has ended'; END IF;
  IF NOT EXISTS (SELECT 1 FROM public.auction_registrations WHERE auction_id = _auction AND user_id = uid AND emd_status = 'paid') THEN
    RAISE EXCEPTION 'Pay the EMD before bidding';
  END IF;
  min_bid := CASE WHEN a.bid_count = 0 THEN a.reserve_price ELSE a.current_price + a.bid_step END;
  IF _amount < min_bid THEN RAISE EXCEPTION 'Minimum bid is %', min_bid; END IF;
  INSERT INTO public.bids (auction_id, user_id, amount) VALUES (_auction, uid, _amount);
  UPDATE public.auctions SET
    current_price = _amount, current_winner = uid, bid_count = bid_count + 1,
    ends_at = CASE WHEN ends_at - now() < make_interval(mins => extension_minutes) THEN now() + make_interval(mins => extension_minutes) ELSE ends_at END
  WHERE id = _auction RETURNING * INTO a;
  RETURN a;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.place_bid(uuid, bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bid(uuid, bigint) TO authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

CREATE POLICY "Request files read" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'request-files' AND (public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.service_requests r WHERE r.id::text = (storage.foldername(name))[1] AND r.user_id = auth.uid())));
CREATE POLICY "Request files upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'request-files' AND (public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.service_requests r WHERE r.id::text = (storage.foldername(name))[1] AND r.user_id = auth.uid())));