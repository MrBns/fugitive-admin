# Fugitive Admin

A complete admin panel for rich blog posting built with React, Vite, TypeScript, Hono, and SQLite.

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
| Backend | Hono on Node.js |
| Auth | Better Auth |
| Database | SQLite via better-sqlite3 |
| Forms | React Hook Form + Zod |

## Getting Started

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173 (client) and http://localhost:3001 (API).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:client` | Vite dev server only |
| `npm run dev:server` | Hono API server only |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
