# Fugitive Admin

A complete admin panel for rich blog posting built with React, Vite, TypeScript, Hono, and SQLite.

## Monorepo Structure

This project uses [Turborepo](https://turbo.build) with [Bun](https://bun.sh) as the package manager and runtime.

```
├── apps/
│   ├── client/   – React 19 + Vite frontend
│   └── server/   – Hono API server (Bun runtime)
├── package.json  – Workspace root
└── turbo.json    – Turborepo pipeline config
```

## Features

- **Authentication** – Sign up / sign in with email & password (powered by Better Auth)
- **Dashboard** – Overview with post stats (total, published, drafts) and recent posts
- **Post Management** – Create, edit, delete blog posts with draft/published status
- **Rich Text Editor** – Tiptap-powered editor with headings, bold/italic/underline, lists, blockquotes, alignment, links, images, highlighting, and word count
- **Responsive UI** – Shadcn/ui components with Tailwind CSS

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + Shadcn/ui |
| Editor | Tiptap |
| Backend | Hono on Bun |
| Auth | Better Auth |
| Database | SQLite via bun:sqlite |
| Forms | React Hook Form + Zod |
| Monorepo | Turborepo |
| Runtime | Bun |

## Getting Started

Requires [Bun](https://bun.sh) >= 1.3.

```bash
bun install
bun dev
```

The app runs at http://localhost:5173 (client) and http://localhost:3001 (API).

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start client + server via Turborepo |
| `bun build` | Production build for all apps |
| `bun lint` | Lint all apps |
| `bun preview` | Preview production builds |

### Per-workspace scripts

```bash
# Client only
cd apps/client && bun dev

# Server only
cd apps/server && bun dev
```
