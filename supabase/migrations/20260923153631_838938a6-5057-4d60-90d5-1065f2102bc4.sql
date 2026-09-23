CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are publicly readable" ON public.profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  city text NOT NULL,
  locality text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'Apartment',
  purpose text NOT NULL DEFAULT 'Buy',
  price_display text NOT NULL DEFAULT '',
  price_value bigint NOT NULL DEFAULT 0,
  beds int NOT NULL DEFAULT 0,
  baths int NOT NULL DEFAULT 0,
  area int NOT NULL DEFAULT 0,
  image_key text,
  image_path text,
  description text NOT NULL DEFAULT '',
  amenities text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'published',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.properties TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published listings are publicly readable" ON public.properties FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Owners read own listings" ON public.properties FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Owners create listings" ON public.properties FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own listings" ON public.properties FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners delete own listings" ON public.properties FOR DELETE TO authenticated USING (auth.uid() = owner_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.favorites (
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, property_id)
);
GRANT SELECT, INSERT, DELETE ON public.favorites TO authenticated;
GRANT ALL ON public.favorites TO service_role;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users add own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.inquiries TO anon;
GRANT SELECT, INSERT ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Owners read inquiries on their listings" ON public.inquiries FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Senders read own inquiries" ON public.inquiries FOR SELECT TO authenticated USING (auth.uid() = sender_id);

CREATE POLICY "Anyone can view property photos" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'property-photos');
CREATE POLICY "Users upload property photos to own folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Users update own property photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'property-photos' AND owner = auth.uid());
CREATE POLICY "Users delete own property photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'property-photos' AND owner = auth.uid());

INSERT INTO public.properties (title, city, locality, type, purpose, price_display, price_value, beds, baths, area, image_key, description, amenities, featured) VALUES
('Skyline Residences','Bengaluru','Whitefield','Apartment','Buy','₹1.48 Cr',14800000,3,3,1840,'apartment','A sunlit, owner-listed home with generous rooms, city views and easy access to Whitefield''s business district.',ARRAY['Clubhouse','Swimming pool','Covered parking','24×7 security','Power backup','Gym'],true),
('Palm Grove Villa','Pune','Baner','Villa','Buy','₹2.85 Cr',28500000,4,4,2960,'villa','A private modern villa surrounded by mature greenery, designed for effortless indoor-outdoor family living.',ARRAY['Private garden','Two-car parking','Terrace','Modular kitchen','Pet friendly','Security'],true),
('Sea View Court','Mumbai','Worli','Apartment','Rent','₹92,000 / month',92000,2,2,1120,'mumbai','A furnished high-floor home with open skyline views, contemporary interiors and excellent south Mumbai connectivity.',ARRAY['Furnished','Sea view','Reserved parking','Concierge','Gym','Lift'],true),
('Vertex Business Suite','Gurugram','Golf Course Road','Office','Commercial','₹2.15 L / month',215000,0,2,3200,'office','A fully fitted premium office with boardroom, reception and flexible workspace for a growing team.',ARRAY['Fully fitted','24×7 access','Reception','Meeting rooms','Parking','Metro nearby'],true),
('Greenwood Heights','Hyderabad','Gachibowli','Apartment','Rent','₹48,000 / month',48000,3,3,1685,'apartment','Spacious gated-community home close to the financial district, schools and everyday conveniences.',ARRAY['Gated society','Pool','Gym','Play area','Parking','Power backup'],false),
('Gardenia House','Delhi','Vasant Kunj','Villa','Buy','₹4.65 Cr',46500000,4,5,3400,'villa','A quiet, independent residence with landscaped outdoor spaces in one of south Delhi''s established neighbourhoods.',ARRAY['Private garden','Staff room','Parking','Terrace','Study','Security'],false);