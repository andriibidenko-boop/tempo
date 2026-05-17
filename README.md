# Tempo

> **Find your tempo. Ship your day.**

A focused to-do list with a live timer that keeps you in flow. Tempo helps you decide what to do next, set a pace, and watch the day move.

**Free. Local-first. No accounts, no payments, no servers.** Your data lives in your browser.

---

## ✨ What Tempo does

Tempo turns your day into a rhythm of focused intervals:

1. **Plan** — drop tasks into a list, optionally estimate how long each will take.
2. **Press Play** — `START FLOW` launches your top task into a live timer.
3. **Stay in tempo** — a floating panel keeps your current task and time visible.
4. **Ship** — finish, celebrate, repeat.

### Timer modes

- **Estimate countdown** — set a target, watch it tick down. Tempo records whether you finished early or late.
- **Pomodoro** — focused intervals with auto-scheduled breaks (default 25/5).
- **Free tracking** — count time up from zero when you don't know how long it'll take.

### Other niceties

- 🎉 Confetti when you complete a task
- 🌓 Light & dark themes
- 🪟 Floating timer panel (planned: Document Picture-in-Picture)
- ⌨️ Keyboard-first (planned)
- 📊 Reports — time per list, punctuality (planned)
- 💾 Local-first via IndexedDB — your data, your browser, that's it

---

## 🛠️ Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Animation | Framer Motion, canvas-confetti |
| State | Zustand (with `persist` to localStorage) |
| Storage | Dexie.js → IndexedDB |
| Drag & Drop | dnd-kit |
| Charts | Tremor |
| Hosting | Vercel |

---

## 🚀 Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗺️ Roadmap

### v0.1 — current
- [x] Project scaffold and design system
- [x] Lists, tasks, completion with confetti
- [x] `START FLOW` button + floating timer panel
- [x] Three timer modes (EST / Pomodoro / Tracking)
- [x] Pause / Resume / Done / Stop
- [x] Session persistence to IndexedDB

### v0.2 — next
- [ ] Subtasks UI + notes editor
- [ ] Drag-and-drop reorder (dnd-kit)
- [ ] Document Picture-in-Picture floating window
- [ ] Web Notifications for timer events
- [ ] Reports page (Tremor)
- [ ] Keyboard shortcuts
- [ ] Theme toggle (next-themes)

### Later
- [ ] Eisenhower Matrix prioritization
- [ ] Recurring tasks
- [ ] Export / import JSON
- [ ] PWA install + offline mode

---

## 📁 Structure

```
src/
├── app/                # Next.js App Router
├── components/
│   ├── ui/             # shadcn primitives
│   ├── task/           # Task list, card, composer
│   ├── timer/          # Floating timer, START FLOW
│   └── layout/         # Sidebar, Topbar
├── hooks/              # useLists, useTasks, useTick
├── lib/
│   ├── db.ts           # Dexie schema
│   └── utils.ts        # cn() helper
└── stores/             # Zustand stores
```

---

## License

MIT
