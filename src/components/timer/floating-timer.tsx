"use client";

import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Pause, Play, Square, ExternalLink, Check } from "lucide-react";
import { useTimer } from "@/stores/timer-store";
import { useTask } from "@/hooks/use-tasks";
import { useTick } from "@/hooks/use-tick";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatTime(seconds: number, signed = false) {
  const abs = Math.abs(seconds);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = abs % 60;
  const sign = signed && seconds < 0 ? "-" : "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${sign}${h}:${pad(m)}:${pad(s)}` : `${sign}${pad(m)}:${pad(s)}`;
}

export function FloatingTimer() {
  const {
    taskId,
    mode,
    pausedAt,
    estimateSeconds,
    getElapsedSeconds,
    pause,
    resume,
    stop,
  } = useTimer();

  useTick(500, !!taskId && !pausedAt);

  const task = useTask(taskId);

  if (!taskId || !task) return null;

  const elapsed = getElapsedSeconds();
  const display =
    mode === "est" && estimateSeconds !== null
      ? estimateSeconds - elapsed
      : elapsed;
  const overdue = mode === "est" && display < 0;

  const completeTask = async () => {
    await db.tasks.update(taskId, {
      completed: true,
      completedAt: Date.now(),
      actualSeconds: elapsed,
      updatedAt: Date.now(),
    });
    await db.sessions.add({
      id: crypto.randomUUID(),
      taskId,
      startedAt: Date.now() - elapsed * 1000,
      endedAt: Date.now(),
      mode,
      durationSeconds: elapsed,
      completed: true,
    });
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
    });
    stop();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
        className="fixed bottom-6 right-6 w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden z-50"
      >
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {mode === "est" && "Estimate"}
            {mode === "pomodoro" && "Pomodoro"}
            {mode === "tracking" && "Tracking"}
          </div>
          <div className="text-sm font-medium truncate mt-0.5">
            {task.title}
          </div>
        </div>

        <div className="py-6 px-4 flex flex-col items-center gap-1">
          <motion.div
            key={Math.floor(elapsed / 60)}
            initial={{ scale: 1 }}
            animate={overdue ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "text-5xl font-mono font-bold tabular-nums tracking-tight",
              overdue && "text-destructive"
            )}
          >
            {formatTime(display, true)}
          </motion.div>
          {pausedAt && (
            <div className="text-xs text-muted-foreground">Paused</div>
          )}
          {overdue && (
            <div className="text-xs text-destructive font-medium">Overtime</div>
          )}
        </div>

        <div className="px-3 pb-3 flex items-center justify-between gap-2">
          {pausedAt ? (
            <Button onClick={resume} size="sm" className="flex-1">
              <Play className="w-4 h-4" /> Resume
            </Button>
          ) : (
            <Button onClick={pause} size="sm" variant="secondary" className="flex-1">
              <Pause className="w-4 h-4" /> Pause
            </Button>
          )}
          <Button onClick={completeTask} size="sm" className="flex-1">
            <Check className="w-4 h-4" /> Done
          </Button>
          <Button onClick={stop} size="icon" variant="ghost" title="Stop">
            <Square className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
