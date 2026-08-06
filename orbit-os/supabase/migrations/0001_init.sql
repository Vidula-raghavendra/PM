-- Orbit OS — initial schema
-- Single source of truth for the database. Apply to a fresh Supabase project.
--
-- Conventions:
--   * snake_case columns (Supabase/Postgres default)
--   * uuid primary keys, defaulting to gen_random_uuid()
--   * profiles.id is FK -> auth.users.id, populated by trigger on signup
--   * timestamptz everywhere; updated_at maintained by trigger

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text,
  full_name   text,
  avatar_url  text,
  phone       text,
  gender      text,
  sector      text,
  purpose     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create the profile row automatically when an auth user is created.
-- This replaces the manual insert in the signup action, which could fail
-- silently and leave the user stuck in an onboarding redirect loop.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  client       text,
  type         text,
  area         text,
  status       text not null default 'ACTIVE'
                 check (status in ('ACTIVE', 'COMPLETED', 'ARCHIVED')),
  start_date   date,
  end_date     date,
  total_budget numeric(14, 2) not null default 0,
  currency     text not null default 'INR',
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- collaborators
-- ---------------------------------------------------------------------------
-- user_id is nullable: a collaborator can be invited by email before they
-- have an account. It is linked on signup by link_pending_collaborators().

create table public.collaborators (
  id               uuid primary key default gen_random_uuid(),
  project_id       uuid not null references public.projects (id) on delete cascade,
  user_id          uuid references public.profiles (id) on delete cascade,
  email            text not null,
  role             text not null default 'MEMBER',
  color            text not null default '#3b82f6',
  split_percentage numeric(5, 2) not null default 0
                     check (split_percentage >= 0 and split_percentage <= 100),
  joined_at        timestamptz not null default now(),
  unique (project_id, email)
);

-- When someone signs up, attach any invitations waiting on their email.
create or replace function public.link_pending_collaborators()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.collaborators
     set user_id = new.id
   where user_id is null
     and lower(email) = lower(new.email);
  return new;
end;
$$;

create trigger on_profile_created_link_collaborators
  after insert on public.profiles
  for each row execute function public.link_pending_collaborators();

-- ---------------------------------------------------------------------------
-- milestones
-- ---------------------------------------------------------------------------

create table public.milestones (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null,
  description text,
  checklist   jsonb not null default '[]'::jsonb,
  amount      numeric(14, 2) not null default 0,
  percentage  numeric(5, 2) not null default 0,
  status      text not null default 'PENDING'
                check (status in ('PENDING', 'PAID', 'OVERDUE')),
  start_date  date,
  due_date    date,
  paid_at     timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger milestones_set_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tasks
-- ---------------------------------------------------------------------------

create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null,
  status      text not null default 'TODO'
                check (status in ('TODO', 'IN_PROGRESS', 'DONE')),
  priority    text not null default 'MEDIUM'
                check (priority in ('LOW', 'MEDIUM', 'HIGH')),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger tasks_set_updated_at
  before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- time_logs
-- ---------------------------------------------------------------------------

create table public.time_logs (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  user_id     uuid not null references public.profiles (id) on delete cascade,
  start_time  timestamptz not null default now(),
  end_time    timestamptz,
  duration    integer,  -- minutes
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger time_logs_set_updated_at
  before update on public.time_logs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------

create table public.documents (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects (id) on delete cascade,
  title       text not null,
  storage_path text not null,  -- path within the `contracts` storage bucket
  type        text not null default 'OTHER'
                check (type in ('CONTRACT', 'INVOICE', 'OTHER')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger documents_set_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- calendar_events
-- ---------------------------------------------------------------------------

create table public.calendar_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  project_id  uuid references public.projects (id) on delete cascade,
  title       text not null,
  description text,
  start_time  timestamptz not null,
  end_time    timestamptz not null,
  type        text not null default 'MEETING'
                check (type in ('MEETING', 'CALL', 'DEADLINE')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger calendar_events_set_updated_at
  before update on public.calendar_events
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- goals
-- ---------------------------------------------------------------------------

create table public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  title       text not null,
  description text,
  target_date date,
  status      text not null default 'IN_PROGRESS'
                check (status in ('IN_PROGRESS', 'ACHIEVED', 'FAILED')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger goals_set_updated_at
  before update on public.goals
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index idx_projects_owner_id        on public.projects (owner_id);
create index idx_projects_status          on public.projects (status);
create index idx_collaborators_project_id on public.collaborators (project_id);
create index idx_collaborators_user_id    on public.collaborators (user_id);
create index idx_collaborators_email      on public.collaborators (lower(email));
create index idx_milestones_project_id    on public.milestones (project_id);
create index idx_milestones_status        on public.milestones (status);
create index idx_tasks_project_id         on public.tasks (project_id);
create index idx_tasks_due_date           on public.tasks (due_date);
create index idx_time_logs_project_id     on public.time_logs (project_id);
create index idx_time_logs_user_id        on public.time_logs (user_id);
create index idx_documents_project_id     on public.documents (project_id);
create index idx_calendar_events_user_id  on public.calendar_events (user_id);
create index idx_calendar_events_start    on public.calendar_events (start_time);
create index idx_goals_user_id            on public.goals (user_id);
