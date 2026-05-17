# Blitzit Web

A free, local-first web clone of [Blitzit](https://www.blitzit.app/) — a focused to-do list with a live focus timer.

> **v0.1** — MVP scaffolding. Data lives in your browser (IndexedDB). No accounts, no payments, no servers.

## ✨ Features (MVP)

- 📋 Task lists with quick-add composer
- ✅ Tasks with completion, drag-to-reorder (coming), notes, time estimates
- ⚡ **BLITZ NOW** button — launches your top task into a live timer
- ⏱️ Three timer modes: Estimate countdown, Pomodoro, free Time-Tracking
- 🪟 Floating timer panel (Document Picture-in-Picture, coming soon)
- 🎉 Confetti celebrations on task completion
- 🌓 Dark / Light theme
- 💾 Local-first via IndexedDB (Dexie) — no servers, no sync, no fuss

## 🛠️ Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animations:** Framer Motion + canvas-confetti
- **State:** Zustand (timer / UI)
- **Storage:** Dexie.js (IndexedDB)
- **Drag & Drop:** dnd-kit (planned)
- **Charts:** Tremor (for Reports, planned)
- **Hosting:** Vercel (planned)

## 🚀 Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🗺️ Roadmap

### v0.1 (current)
- [x] Project scaffold + design system
- [x] Lists, tasks, completion
- [x] BLITZ NOW + floating timer panel
- [x] EST / Pomodoro / Tracking modes
- [x] Confetti micro-interactions

### v0.2
- [ ] Subtasks UI
- [ ] Task notes editor
- [ ] Drag-and-drop reorder (dnd-kit)
- [ ] Document Picture-in-Picture floating window
- [ ] Web Notifications for timer events
- [ ] Reports page (time by list, punctuality)
- [ ] Keyboard shortcuts
- [ ] Theme toggle (next-themes)

### Later
- [ ] Eisenhower Matrix
- [ ] Recurring tasks
- [ ] Export / import data
- [ ] PWA install + offline

## 📁 Project structure

```
src/
├── app/                # Next.js App Router
├── components/
│   ├── ui/             # shadcn primitives
│   ├── task/           # Task list, card, composer
│   ├── timer/          # Floating timer, BLITZ NOW
│   └── layout/         # Sidebar, Topbar
├── hooks/              # useLists, useTasks, useTick
├── lib/
│   ├── db.ts           # Dexie schema
│   └── utils.ts        # cn() helper
└── stores/             # Zustand stores
```

## License

MIT
