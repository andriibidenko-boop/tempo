# Tempo — Project Context

This file is the project's master context for Claude Code (and any other AI agent or new contributor). Read it first before making changes.

---

## What we are building

**Tempo** is a focused to-do list with a live focus timer for the web. The product is built around one core loop:

> Decide what to do next → press Play → watch a live timer → ship the task → repeat.

The product philosophy:

- **Local-first.** No accounts, no servers, no payments, no analytics tracking the user. Data lives in IndexedDB.
- **Free forever.** No paid tiers, no upsell.
- **One task at a time.** The interface should always make it obvious what to do next.
- **Satisfying.** Micro-animations, confetti, smooth transitions — the app should feel alive.
- **Snappy.** Sub-100ms interactions. State updates are optimistic; persistence is fire-and-forget.

If a feature breaks any of those, push back and discuss.

---

## Repo layout

```
tempo/
├── CLAUDE.md             ← This file — read FIRST
├── README.md             ← Public-facing project description
├── package.json
├── components.json       ← shadcn/ui config
├── tsconfig.json
├── next.config.ts
├── public/
└── src/
    ├── app/              ← Next.js App Router pages
    │   ├── layout.tsx
    │   ├── page.tsx      ← Home (active list + tasks + START FLOW)
    │   └── globals.css   ← Tailwind + shadcn CSS vars
    ├── components/
    │   ├── ui/           ← shadcn primitives (DO NOT edit unless restyling)
    │   ├── task/         ← TaskList, TaskCard, TaskComposer
    │   ├── timer/        ← StartFlowButton, FloatingTimer
    │   ├── layout/       ← Sidebar, Topbar
    │   └── db-init.tsx   ← One-time IndexedDB seed
    ├── hooks/
    │   ├── use-lists.ts  ← useLists(), useList(id)
    │   ├── use-tasks.ts  ← useTasks(listId), useTask(id), useSubtasks(taskId)
    │   └── use-tick.ts   ← forces re-render every N ms (timer display)
    ├── lib/
    │   ├── db.ts         ← Dexie schema + ensureDefaults()
    │   └── utils.ts      ← cn() Tailwind merge helper
    ├── stores/
    │   ├── timer-store.ts ← Zustand: active task, mode, start/pause/stop
    │   └── ui-store.ts    ← Zustand: active list, sidebar, composer
    └── workers/          ← (planned) Web Worker for timer accuracy
```

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR-capable, file routing, Vercel-friendly |
| Language | TypeScript strict | Required — many subtle state shapes |
| Styling | Tailwind v4 + shadcn/ui (new-york style) | Copy-paste primitives, OKLCH theme tokens |
| Animation | Framer Motion + canvas-confetti | Micro-interactions are 50% of the UX |
| State | Zustand + `persist` to localStorage | Lightweight, no provider gymnastics |
| Storage | Dexie.js → IndexedDB | Local-first, reactive via `useLiveQuery` |
| Drag & Drop | dnd-kit | Accessible, touch-friendly (planned integration) |
| Charts | Tremor | For Reports page (planned) |
| Hosting | Vercel | Free tier sufficient |

### Hard rules

- **No backend.** Do not add Supabase, Firebase, server-side state, or API routes that store user data. Server actions for pure compute are OK.
- **No payment code.** This project is free forever.
- **No analytics on user data.** Vercel deployment analytics are fine; product analytics that track tasks/timer data are not.
- **No new heavy dependencies without discussion.** Bundle size matters. Tree-shake-friendly libraries only.

---

## Data model (IndexedDB via Dexie)

Schema lives in `src/lib/db.ts`. Version 1:

| Table | Indexed fields | Notes |
|---|---|---|
| `lists` | `id, order, archived` | User-defined task lists. Default "Inbox" seeded on first load. |
| `tasks` | `id, listId, completed, scheduledAt, order, [listId+completed]` | One row per task. `actualSeconds` accumulates from sessions. |
| `subtasks` | `id, taskId, order` | Optional nested items under a task. |
| `sessions` | `id, taskId, startedAt, mode` | One row per timer session (start → stop or completion). |
| `settings` | `id` (always `"singleton"`) | User preferences (theme, Pomodoro durations, sounds, confetti). |

Reactive reads use `useLiveQuery` from `dexie-react-hooks`. **Always** wrap queries in an `async` function so TypeScript infers correctly. Pass a default value as the third arg to avoid `undefined` flicker.

**Migration policy:** if a schema change is breaking, bump Dexie version and add an upgrade callback. Never silently drop user data.

---

## State (Zustand)

Two stores. Keep them small.

- `useTimer` (`src/stores/timer-store.ts`) — the ONLY source of truth for the active timer. Drift-resistant: stores `startTime` and `totalPausedMs` as timestamps; the display reads `Date.now() - startTime - totalPausedMs`. Persists to `localStorage` so a reload keeps you in flow.
- `useUI` (`src/stores/ui-store.ts`) — `activeListId`, `isSidebarOpen`, etc. Partializes which keys persist.

Do not put server data, list contents, or task arrays in Zustand. Those live in IndexedDB and are read via `useLiveQuery`.

---

## UI conventions

- **shadcn `new-york` style** + neutral base colors. CSS variables in `globals.css` use OKLCH.
- **Theme:** light/dark via the `.dark` class on `<html>`. (Toggle UI is planned via `next-themes`.)
- **Icons:** Lucide React. Always.
- **Animations:** Framer Motion. Default spring `{ stiffness: 200, damping: 20 }` for entrances; `duration: 0.18` for layout transitions.
- **Confetti:** call `confetti({...})` on completion (task done, day done). Keep it short and not annoying — `particleCount: 60`, `scalar: 0.9` for task completion; bigger for day complete.
- **Toasts:** `sonner` only. Use sparingly — confirmations of irreversible actions, not chatty success messages.
- **Empty states:** always show a friendly hint, never a blank screen.

---

## How to run

```bash
pnpm install
pnpm dev      # → http://localhost:3000
pnpm build    # production build (must pass before commit)
pnpm lint     # eslint
```

If you touch the Dexie schema, clear `IndexedDB.tempo` in DevTools → Application → IndexedDB to reseed defaults.

---

## How to add things (recipes)

### A new feature page

1. Add route file under `src/app/<route>/page.tsx`.
2. Wrap client-only logic in a `"use client"` component under `src/components/<area>/`.
3. Add a sidebar entry in `src/components/layout/sidebar.tsx`.

### A new field on Task

1. Update `Task` interface in `src/lib/db.ts`.
2. Bump Dexie version and add an `.upgrade()` callback if the field requires backfill.
3. Update everywhere it's read (`task-card.tsx`, `task-list.tsx`, hooks).
4. Update the composer if user-editable.

### A new timer mode

1. Add the mode literal to `TimerMode` in `src/lib/db.ts`.
2. Extend `useTimer` start logic if config differs.
3. Update `FloatingTimer` display + label.
4. Update `StartFlowButton` if it should auto-select the new mode.

### A new shadcn component

```bash
pnpm dlx shadcn@4.6.0 add <component-name>
```

(Stick to `4.6.0` for now — newer versions had issues with our Tailwind v4 setup.)

---

## What NOT to do

- ❌ Don't add server-side state for user data. Tempo is local-first.
- ❌ Don't import from `next/server` for product logic.
- ❌ Don't store derived state in Zustand if it can come from a `useLiveQuery`.
- ❌ Don't bypass `useLiveQuery` — direct `await db.tasks.get(...)` outside of mutations creates stale UI.
- ❌ Don't introduce new fonts. Geist Sans + Geist Mono via `next/font/google`.
- ❌ Don't add analytics that observe user content.
- ❌ Don't add payment, auth, or subscription code.

---

## Open questions / decisions to revisit

- **Document Picture-in-Picture floating window** — planned for v0.2. Will require client-only mount and stylesheet cloning. Fallback to in-tab compact mode for Safari/Firefox.
- **Web Worker for timer ticks** — overkill at 250–500 ms intervals; the `Date.now()` delta math already handles tab throttling. Skip unless we add sub-second precision use cases.
- **Export/import data** — wanted by power users, plus useful for backup. JSON dump of IndexedDB. Plan for v0.3.

---

## Commit conventions

- One purpose per commit.
- Conventional commits when possible: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- `pnpm build` must succeed before any commit that touches code.
- AI-generated commits include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`.

---

## Where to look first when starting a task

1. **This file.** Project rules and structure.
2. **`README.md`** — what the product is.
3. **`src/lib/db.ts`** — data shape, ground truth.
4. **`src/stores/`** — runtime state.
5. **`src/app/page.tsx`** — composition root for the main screen.

Then dig into the component you're changing.
