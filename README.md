# THYN — Relationship Memory for LinkedIn

**THYN V1** is a simple, focused tool to remember your LinkedIn relationships.

Not an AI CRM. Not a browser dashboard. Not a team platform. Just your contacts, notes, and reminders — tied to LinkedIn profiles.

## Architecture

```
extension/   — Chrome Extension (LinkedIn sidebar)
backend/     — Fastify API (contacts, notes, reminders)
web/         — Next.js dashboard (auth, contacts, settings)
```

### Stack

| Component | Tech |
|-----------|------|
| Extension | React 18, TypeScript, Vite 6, Chrome MV3 |
| Backend   | Fastify 5, TypeScript, Prisma 6, PostgreSQL |
| Web       | Next.js 15, TypeScript, TailwindCSS |
| Auth      | Supabase Auth (Google OAuth) |

## Quick Start

### 1. Supabase

Create a project at [supabase.com](https://supabase.com), then set up auth:

- Enable **Google** provider in Auth → Providers
- Get your project URL, anon key, and service role key

### 2. Backend

```bash
cd backend
cp .env.example .env     # fill in Supabase credentials
npm install
npx prisma db push       # sync schema to DB
npm run dev              # starts on :3001
```

### 3. Web Dashboard

```bash
cd web
cp .env.local.example .env.local  # fill in Supabase credentials
npm install
npm run dev                       # starts on :3000
```

### 4. Extension

```bash
cd extension
npm install
npm run dev          # builds & watches
```

Load the `extension/dist` folder in Chrome → `chrome://extensions` → Load unpacked.

### 5. Usage

1. Open `linkedin.com/in/*` — the content script detects the profile
2. Click the THYN toolbar icon → **Open Side Panel**
3. Paste your access token from dashboard settings
4. **Save Contact**, add notes and reminders

## Pages

- `/auth` — Sign in with Google
- `/dashboard` — View all saved contacts
- `/contact/[id]` — Contact detail with notes & reminders
- `/settings` — Account info & access token

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/session` | Exchange Supabase token |
| GET | `/auth/me` | Current user profile |
| GET | `/contacts` | List contacts |
| POST | `/contacts` | Save a LinkedIn contact |
| GET | `/contacts/:id` | Contact detail |
| PUT | `/contacts/:id` | Update contact |
| DELETE | `/contacts/:id` | Delete contact |
| POST | `/notes` | Add note to contact |
| GET | `/notes/contact/:id` | List notes for contact |
| POST | `/reminders` | Add reminder |
| GET | `/reminders?upcoming=true` | List reminders |
| PUT | `/reminders/:id/done` | Mark reminder done |

## SSOT

THYN V1 is defined by a strict Source of Truth:

> THYN = Relationship Memory for LinkedIn
> Not AI CRM / Not Browser Memory / Not Teams / Not Analytics / Not Enterprise

Everything in this repo aligns to that principle. No AI, no billing, no analytics, no workspaces, no CRM — just contacts, notes, and reminders tied to LinkedIn.
