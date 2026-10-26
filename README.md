# Orbit OS

A project and billing tracker for people who get paid in milestones: architects, designers, studios, consultants and freelancers. Each milestone is both a deliverable to finish and an amount to invoice, so revenue, progress and payment status all come from the same record.

**Next.js 16 · TypeScript · Supabase (Postgres + Row Level Security) · Tailwind · Zod · Vercel**

👉 **The app lives in [`orbit-os/`](orbit-os/).** Its [README](orbit-os/README.md) covers the data model, setup, migrations and design decisions.

## Quick start

```bash
cd orbit-os
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

## What else is in this repo

| Path | Purpose |
|---|---|
| `orbit-os/` | The application |
| `.github/workflows/daily-log.yml` | GitHub Action that writes a daily project log (git activity + project stats) |
| `logs/` | Output of that action, one file per day |
