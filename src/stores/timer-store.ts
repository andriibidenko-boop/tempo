import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TimerMode } from "@/lib/db";

interface TimerState {
  taskId: string | null;
  mode: TimerMode;
  startTime: number | null;
  pausedAt: number | null;
  totalPausedMs: number;
  estimateSeconds: number | null;
  isFloating: boolean;

  start: (taskId: string, mode: TimerMode, estimateSeconds?: number) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleFloating: () => void;
  getElapsedSeconds: () => number;
}

export const useTimer = create<TimerState>()(
  persist(
    (set, get) => ({
      taskId: null,
      mode: "tracking",
      startTime: null,
      pausedAt: null,
      totalPausedMs: 0,
      estimateSeconds: null,
      isFloating: false,

      start: (taskId, mode, estimateSeconds) => {
        set({
          taskId,
          mode,
          startTime: Date.now(),
          pausedAt: null,
          totalPausedMs: 0,
          estimateSeconds: estimateSeconds ?? null,
        });
      },

      pause: () => {
        if (!get().pausedAt) {
          set({ pausedAt: Date.now() });
        }
      },

      resume: () => {
        const { pausedAt, totalPausedMs } = get();
        if (pausedAt) {
          set({
            pausedAt: null,
            totalPausedMs: totalPausedMs + (Date.now() - pausedAt),
          });
        }
      },

      stop: () => {
        set({
          taskId: null,
          startTime: null,
          pausedAt: null,
          totalPausedMs: 0,
          estimateSeconds: null,
          isFloating: false,
        });
      },

      toggleFloating: () => set({ isFloating: !get().isFloating }),

      getElapsedSeconds: () => {
        const { startTime, pausedAt, totalPausedMs } = get();
        if (!startTime) return 0;
        const now = pausedAt ?? Date.now();
        return Math.max(0, Math.floor((now - startTime - totalPausedMs) / 1000));
      },
    }),
    {
      name: "blitzit-timer",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
