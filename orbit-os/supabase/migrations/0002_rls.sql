-- Orbit OS — row level security
--
-- Access model:
--   * A project is readable by its owner and by its linked collaborators.
--   * A project is mutable only by its owner.
--   * Child rows (milestones, tasks, documents) follow the parent project:
--     readable by anyone with project access, mutable by the owner.
--   * time_logs, goals and calendar_events are owned directly by a user.
--
-- Note on helper functions: putting the project-access check inside a
-- SECURITY DEFINER function avoids infinite recursion between the projects
-- and collaborators policies (projects reads collaborators, collaborators
-- reads projects), which is the classic Supabase RLS footgun.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_project_owner(p_project_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects
     where id = p_project_id
       and owner_id = auth.uid()
  );
$$;

create or replace function public.can_access_project(p_project_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.projects
     where id = p_project_id
       and owner_id = auth.uid()
  )
  or exists (
    select 1 from public.collaborators
     where project_id = p_project_id
       and user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Enable RLS
-- ---------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.projects        enable row level security;
alter table public.collaborators   enable row level security;
alter table public.milestones      enable row level security;
alter table public.tasks           enable row level security;
alter table public.time_logs       enable row level security;
alter table public.documents       enable row level security;
alter table public.calendar_events enable row level security;
alter table public.goals           enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create policy "own profile is readable"
  on public.profiles for select
  using (auth.uid() = id);

-- Needed so the People page can resolve collaborator names/emails.
-- Limited to people you actually share a project with.
create policy "collaborator profiles are readable"
  on public.profiles for select
  using (
    exists (
      select 1
        from public.collaborators c
        join public.projects p on p.id = c.project_id
       where c.user_id = profiles.id
         and p.owner_id = auth.uid()
    )
    or exists (
      select 1
        from public.collaborators mine
        join public.collaborators theirs on theirs.project_id = mine.project_id
       where mine.user_id = auth.uid()
         and theirs.user_id = profiles.id
    )
  );

create policy "own profile is insertable"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "own profile is updatable"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create policy "projects readable by owner or collaborator"
  on public.projects for select
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.collaborators
       where project_id = projects.id
         and user_id = auth.uid()
    )
  );

create policy "projects insertable by owner"
  on public.projects for insert
  with check (owner_id = auth.uid());

create policy "projects updatable by owner"
  on public.projects for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "projects deletable by owner"
  on public.projects for delete
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- collaborators
-- ---------------------------------------------------------------------------

create policy "collaborators readable with project access"
  on public.collaborators for select
  using (user_id = auth.uid() or public.can_access_project(project_id));

create policy "collaborators managed by project owner"
  on public.collaborators for insert
  with check (public.is_project_owner(project_id));

create policy "collaborators updatable by project owner"
  on public.collaborators for update
  using (public.is_project_owner(project_id))
  with check (public.is_project_owner(project_id));

create policy "collaborators deletable by project owner"
  on public.collaborators for delete
  using (public.is_project_owner(project_id));

-- ---------------------------------------------------------------------------
-- milestones / tasks / documents  (child rows follow the parent project)
-- ---------------------------------------------------------------------------

create policy "milestones readable with project access"
  on public.milestones for select
  using (public.can_access_project(project_id));

create policy "milestones insertable by project owner"
  on public.milestones for insert
  with check (public.is_project_owner(project_id));

create policy "milestones updatable by project owner"
  on public.milestones for update
  using (public.is_project_owner(project_id))
  with check (public.is_project_owner(project_id));

create policy "milestones deletable by project owner"
  on public.milestones for delete
  using (public.is_project_owner(project_id));

create policy "tasks readable with project access"
  on public.tasks for select
  using (public.can_access_project(project_id));

-- Collaborators can move tasks along; only the owner can add or remove them.
create policy "tasks updatable with project access"
  on public.tasks for update
  using (public.can_access_project(project_id))
  with check (public.can_access_project(project_id));

create policy "tasks insertable by project owner"
  on public.tasks for insert
  with check (public.is_project_owner(project_id));

create policy "tasks deletable by project owner"
  on public.tasks for delete
  using (public.is_project_owner(project_id));

create policy "documents readable with project access"
  on public.documents for select
  using (public.can_access_project(project_id));

create policy "documents insertable by project owner"
  on public.documents for insert
  with check (public.is_project_owner(project_id));

create policy "documents updatable by project owner"
  on public.documents for update
  using (public.is_project_owner(project_id))
  with check (public.is_project_owner(project_id));

create policy "documents deletable by project owner"
  on public.documents for delete
  using (public.is_project_owner(project_id));

-- ---------------------------------------------------------------------------
-- time_logs  (own rows, and only against projects you can access)
-- ---------------------------------------------------------------------------

create policy "own time logs are readable"
  on public.time_logs for select
  using (user_id = auth.uid() or public.is_project_owner(project_id));

create policy "own time logs are insertable"
  on public.time_logs for insert
  with check (user_id = auth.uid() and public.can_access_project(project_id));

create policy "own time logs are updatable"
  on public.time_logs for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own time logs are deletable"
  on public.time_logs for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- calendar_events / goals  (directly user-owned)
-- ---------------------------------------------------------------------------

create policy "own calendar events are readable"
  on public.calendar_events for select
  using (user_id = auth.uid());

create policy "own calendar events are insertable"
  on public.calendar_events for insert
  with check (user_id = auth.uid());

create policy "own calendar events are updatable"
  on public.calendar_events for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own calendar events are deletable"
  on public.calendar_events for delete
  using (user_id = auth.uid());

create policy "own goals are readable"
  on public.goals for select
  using (user_id = auth.uid());

create policy "own goals are insertable"
  on public.goals for insert
  with check (user_id = auth.uid());

create policy "own goals are updatable"
  on public.goals for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own goals are deletable"
  on public.goals for delete
  using (user_id = auth.uid());
