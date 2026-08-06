-- Orbit OS — storage bucket for project documents
--
-- Files are stored at `<project_id>/<filename>`, so the first path segment
-- is used to check project access.

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "contracts readable with project access"
  on storage.objects for select
  using (
    bucket_id = 'contracts'
    and public.can_access_project(((storage.foldername(name))[1])::uuid)
  );

create policy "contracts uploadable by project owner"
  on storage.objects for insert
  with check (
    bucket_id = 'contracts'
    and public.is_project_owner(((storage.foldername(name))[1])::uuid)
  );

create policy "contracts deletable by project owner"
  on storage.objects for delete
  using (
    bucket_id = 'contracts'
    and public.is_project_owner(((storage.foldername(name))[1])::uuid)
  );
