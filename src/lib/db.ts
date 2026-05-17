import Dexie, { Table } from "dexie";

export type TimerMode = "est" | "pomodoro" | "tracking";
export type ThemeMode = "light" | "dark" | "system";

export interface List {
  id: string;
  name: string;
  emoji?: string;
  color?: string;
  order: number;
  archived: boolean;
  createdAt: number;
}

export interface Task {
  id: string;
  listId: string;
  title: string;
  notes?: string;
  estimateMinutes?: number;
  actualSeconds: number;
  scheduledAt?: number;
  recurringRule?: string;
  completed: boolean;
  completedAt?: number;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  order: number;
}

export interface Session {
  id: string;
  taskId: string;
  startedAt: number;
  endedAt?: number;
  mode: TimerMode;
  durationSeconds: number;
  completed: boolean;
}

export interface Settings {
  id: "singleton";
  theme: ThemeMode;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
  notificationSound: string;
  enableConfetti: boolean;
  enableSounds: boolean;
}

class TempoDB extends Dexie {
  lists!: Table<List, string>;
  tasks!: Table<Task, string>;
  subtasks!: Table<Subtask, string>;
  sessions!: Table<Session, string>;
  settings!: Table<Settings, string>;

  constructor() {
    super("tempo");
    this.version(1).stores({
      lists: "id, order, archived",
      tasks: "id, listId, completed, scheduledAt, order, [listId+completed]",
      subtasks: "id, taskId, order",
      sessions: "id, taskId, startedAt, mode",
      settings: "id",
    });
  }
}

export const db = new TempoDB();

export const DEFAULT_SETTINGS: Settings = {
  id: "singleton",
  theme: "system",
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
  notificationSound: "default",
  enableConfetti: true,
  enableSounds: true,
};

export async function ensureDefaults() {
  const settings = await db.settings.get("singleton");
  if (!settings) {
    await db.settings.put(DEFAULT_SETTINGS);
  }

  const listsCount = await db.lists.count();
  if (listsCount === 0) {
    await db.lists.add({
      id: crypto.randomUUID(),
      name: "Inbox",
      emoji: "📥",
      order: 0,
      archived: false,
      createdAt: Date.now(),
    });
  }
}
