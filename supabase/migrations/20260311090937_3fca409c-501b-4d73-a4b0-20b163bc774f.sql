
-- Homepage buttons table
CREATE TABLE public.homepage_buttons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  variant TEXT NOT NULL DEFAULT 'primary',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.homepage_buttons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read homepage_buttons" ON public.homepage_buttons FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert homepage_buttons" ON public.homepage_buttons FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update homepage_buttons" ON public.homepage_buttons FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete homepage_buttons" ON public.homepage_buttons FOR DELETE TO public USING (true);

CREATE TRIGGER update_homepage_buttons_updated_at
  BEFORE UPDATE ON public.homepage_buttons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Server features table
CREATE TABLE public.server_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'star',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.server_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read server_features" ON public.server_features FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert server_features" ON public.server_features FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update server_features" ON public.server_features FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete server_features" ON public.server_features FOR DELETE TO public USING (true);

CREATE TRIGGER update_server_features_updated_at
  BEFORE UPDATE ON public.server_features
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Logo storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);

CREATE POLICY "Anyone can upload logos" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'logos');
CREATE POLICY "Anyone can read logos" ON storage.objects FOR SELECT TO public USING (bucket_id = 'logos');
CREATE POLICY "Anyone can update logos" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'logos');
CREATE POLICY "Anyone can delete logos" ON storage.objects FOR DELETE TO public USING (bucket_id = 'logos');
