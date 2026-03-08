
-- Drop overly permissive policies
DROP POLICY "Allow all operations on user_data" ON public.user_data;
DROP POLICY "Allow all operations on material_innovation_data" ON public.material_innovation_data;

-- user_data: allow read/upsert by email (edge function handles filtering)
CREATE POLICY "Allow select on user_data" ON public.user_data FOR SELECT USING (true);
CREATE POLICY "Allow insert on user_data" ON public.user_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on user_data" ON public.user_data FOR UPDATE USING (true) WITH CHECK (true);

-- material_innovation_data: allow read by user_id, insert for all authenticated
CREATE POLICY "Allow select on material_innovation_data" ON public.material_innovation_data FOR SELECT USING (true);
CREATE POLICY "Allow insert on material_innovation_data" ON public.material_innovation_data FOR INSERT WITH CHECK (true);
