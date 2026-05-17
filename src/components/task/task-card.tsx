"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Check, Clock, Play, Trash2 } from "lucide-react";
import { Task, db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/stores/timer-store";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const startTimer = useTimer((s) => s.start);
  const activeTaskId = useTimer((s) => s.taskId);
  const isActive = activeTaskId === task.id;

  const toggle = async () => {
    const completing = !task.completed;
    await db.tasks.update(task.id, {
      completed: completing,
      completedAt: completing ? Date.now() : undefined,
      updatedAt: Date.now(),
    });

    if (completing) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        ticks: 100,
        scalar: 0.9,
      });
    }
  };

  const remove = async () => {
    await db.tasks.delete(task.id);
    await db.subtasks.where("taskId").equals(task.id).delete();
  };

  const start = () => {
    startTimer(
      task.id,
      task.estimateMinutes ? "est" : "tracking",
      task.estimateMinutes ? task.estimateMinutes * 60 : undefined
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 rounded-lg border bg-card hover:shadow-sm transition-shadow",
        isActive && "ring-2 ring-primary border-transparent",
        task.completed && "opacity-60"
      )}
    >
      <button
        onClick={toggle}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
          task.completed
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary"
        )}
      >
        {task.completed && <Check className="w-3 h-3" strokeWidth={3} />}
      </button>

      <div className="flex-1 min-w-0">
        <div
          className={cn(
            "text-sm truncate",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </div>
        {task.estimateMinutes && !task.completed && (
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {task.estimateMinutes}m
          </div>
        )}
      </div>

      {!task.completed && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Button size="icon" variant="ghost" onClick={start} className="h-7 w-7">
            <Play className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={remove}
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </motion.div>
  );
}
