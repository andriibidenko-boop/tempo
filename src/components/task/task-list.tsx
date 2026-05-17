"use client";

import { AnimatePresence } from "framer-motion";
import { useUI } from "@/stores/ui-store";
import { useTasks } from "@/hooks/use-tasks";
import { TaskCard } from "./task-card";

export function TaskList() {
  const { activeListId } = useUI();
  const tasks = useTasks(activeListId);

  const open = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  if (!activeListId) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Pick a list from the sidebar to get started.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {open.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>

      {open.length === 0 && done.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks yet. Add one above.
        </div>
      )}

      {done.length > 0 && (
        <>
          <div className="px-3 pt-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Completed ({done.length})
          </div>
          <AnimatePresence initial={false}>
            {done.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
