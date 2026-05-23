
-- Remove overly permissive public SELECT on profiles
drop policy if exists "Profiles viewable by everyone" on public.profiles;

-- Owner can read their own profile
create policy "Users view own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Admins can read any profile
create policy "Admins view all profiles"
on public.profiles
for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Public-safe view: never exposes phone
create or replace view public.public_profiles
with (security_invoker = true) as
select id, full_name, avatar_url, created_at
from public.profiles;

grant select on public.public_profiles to anon, authenticated;

-- Explicit deny of self-insert into user_roles (defense in depth against privilege escalation)
create policy "Users cannot self-assign roles"
on public.user_roles
as restrictive
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));
