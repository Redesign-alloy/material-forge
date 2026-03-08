
-- Create user_data table
CREATE TABLE public.user_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  search_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create material_innovation_data table
CREATE TABLE public.material_innovation_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  grade_name TEXT,
  redesign_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_innovation_data ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_data (edge function uses anon key, so allow anon access)
CREATE POLICY "Allow all operations on user_data" ON public.user_data FOR ALL USING (true) WITH CHECK (true);

-- RLS policies for material_innovation_data
CREATE POLICY "Allow all operations on material_innovation_data" ON public.material_innovation_data FOR ALL USING (true) WITH CHECK (true);
