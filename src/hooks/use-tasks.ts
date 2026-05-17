"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, Task, Subtask } from "@/lib/db";

export function useTasks(listId: string | null): Task[] {
  const value = useLiveQuery(
    async () => {
      if (!listId) return [] as Task[];
      const arr = await db.tasks.where("listId").equals(listId).toArray();
      return arr.sort((a, b) => a.order - b.order);
    },
    [listId],
    [] as Task[]
  );
  return value ?? [];
}

export function useTask(id: string | null): Task | undefined {
  return useLiveQuery(
    async () => (id ? await db.tasks.get(id) : undefined),
    [id]
  );
}

export function useSubtasks(taskId: string | null): Subtask[] {
  const value = useLiveQuery(
    async () => {
      if (!taskId) return [] as Subtask[];
      const arr = await db.subtasks.where("taskId").equals(taskId).toArray();
      return arr.sort((a, b) => a.order - b.order);
    },
    [taskId],
    [] as Subtask[]
  );
  return value ?? [];
}
