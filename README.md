# THYN — The AI Operating System for the Browser

Turn any webpage into action. THYN is a premium Apple-style glassmorphism Chrome Extension + SaaS workspace that transforms browsing into productive outcomes.

## Architecture

```
THYN/
├─ extension/     Chrome Extension (React + TypeScript + Vite + Tailwind)
├─ backend/       API Server (Fastify + TypeScript + Prisma + PostgreSQL)
├─ web/           SaaS Dashboard (Next.js 15 + TypeScript + Tailwind)
└─ README.md
```

## Features

- **Capture** any page, selection, or media with one click
- **Understand** with AI — summarize, extract tasks, generate emails, create flashcards
- **Organize** in a persistent workspace with tags, folders, and search
- **Act** — convert pages into action items, briefs, study notes, and social posts
- **Share** — public brief links, exports, and team collaboration
- **Compare** — analyze multiple tabs and create decision reports

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Extension | React 18, TypeScript, Vite 6, TailwindCSS, Framer Motion, Zustand |
| Web App | Next.js 15, TypeScript, TailwindCSS, shadcn/ui |
| Backend | Node.js, Fastify 5, TypeScript, Prisma ORM |
| Database | PostgreSQL |
| Cache/Queue | Redis, BullMQ |
| AI | OpenAI GPT-4o-mini, Gemini 2.0 Flash, Claude |
| Auth | Chrome Identity API + JWT |
| Realtime | WebSocket |

## Getting Started

### Extension

```bash
cd extension
pnpm install
pnpm dev
```

Load the `dist` folder as an unpacked extension in Chrome.

### Backend

```bash
cd backend
pnpm install
cp .env.example .env
# Edit .env with your database and API keys
pnpm db:push
pnpm dev
```

### Web App

```bash
cd web
pnpm install
pnpm dev
```

## Chrome Web Store

1. Run `pnpm build` in `extension/`
2. Zip the `dist` folder
3. Upload to Chrome Web Store Developer Dashboard
4. Required: privacy policy, screenshots, feature list

## License

Private — All rights reserved.
