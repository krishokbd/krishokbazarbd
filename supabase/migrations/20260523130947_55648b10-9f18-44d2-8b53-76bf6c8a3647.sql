alter publication supabase_realtime add table public.farmer_applications;
alter table public.farmer_applications replica identity full;