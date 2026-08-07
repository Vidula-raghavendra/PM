# Orbit OS

A project and billing tracker for people who get paid in milestones — architects,
designers, studios, consultants, and freelancers.

Most project tools treat money as an afterthought, and most invoicing tools treat
the work as an afterthought. Orbit OS makes the **milestone** the atomic unit: it
is simultaneously a deliverable to complete and an amount to invoice. Revenue,
progress, and payment status all derive from the same record.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Database | Supabase (Postgres + Row Level Security) |
| Auth | Supabase Auth, httpOnly cookie sessions |
| Storage | Supabase Storage (private bucket, signed URLs) |
| Styling | Tailwind CSS, Radix UI primitives |
| Validation | Zod |
| Hosting | Vercel |

## Data model

```
profiles  ──┬── projects ──┬── milestones   (amount, %, due date, PAID/PENDING)
            │              ├── tasks
            │              ├── time_logs
            │              ├── documents    (contracts, in private storage)
            │              └── collaborators (role, colour, revenue split %)
            ├── goals
            └── calendar_events
```

A project is readable by its owner and its collaborators, and mutable only by
its owner. This is enforced in the database by RLS rather than in application
code, so a missing check in a query cannot leak another user's data.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

### Database

Apply the migrations in order to a fresh Supabase project, either through the
SQL editor or the Supabase CLI:

```bash
supabase db push
```

| Migration | Contents |
|---|---|
| `0001_init.sql` | Tables, indexes, `updated_at` triggers, and the `handle_new_user` trigger that creates a profile on signup |
| `0002_rls.sql` | Row level security policies for every table |
| `0003_storage.sql` | Private `contracts` bucket and its access policies |

Then turn **off** email confirmation under Authentication → Providers → Email,
or signup will complete without returning a session.

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous key, subject to RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Bypasses RLS — never expose to the browser |
| `CRON_SECRET` | Authorises the keepalive cron |

## Notes on a few decisions

**`src/lib/mappers.ts`** — Postgres returns `snake_case` columns and ISO date
strings; the UI works in `camelCase` with `Date` objects. Mapping happens in one
place so pages never touch raw rows.

**`can_access_project()` is `SECURITY DEFINER`** — the projects policy needs to
read `collaborators` and the collaborators policy needs to read `projects`, which
recurses. Moving the check into a definer function breaks the cycle.

**Collaborators are invited by email** — `collaborators.user_id` stays null until
that person signs up, at which point the `link_pending_collaborators` trigger
attaches the invitation to their new profile.

**`/api/keepalive`** — Supabase pauses free-tier projects after 7 idle days and
recovery requires a manual restore, so a Vercel cron runs a real query twice a
week. Pinging a cached page would not count as activity.

## Status

Working: authentication and onboarding, project creation (multi-step wizard with
milestones, collaborators, and contract upload), project detail, finance
overview, time logs, calendar, goals, people.

In progress: marking milestones as paid from the UI, task creation, and project
editing. See the repository issues for the current list.
