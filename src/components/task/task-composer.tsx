"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUI } from "@/stores/ui-store";
import { useTasks } from "@/hooks/use-tasks";
import { db } from "@/lib/db";

export function TaskComposer() {
  const { activeListId } = useUI();
  const tasks = useTasks(activeListId);
  const [title, setTitle] = useState("");

  const submit = async () => {
    const trimmed = title.trim();
    if (!trimmed || !activeListId) return;

    const now = Date.now();
    await db.tasks.add({
      id: crypto.randomUUID(),
      listId: activeListId,
      title: trimmed,
      actualSeconds: 0,
      completed: false,
      order: tasks.length,
      createdAt: now,
      updatedAt: now,
    });
    setTitle("");
  };

  return (
    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg border border-border bg-card focus-within:ring-2 focus-within:ring-ring transition-all">
      <Plus className="w-4 h-4 text-muted-foreground" />
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        placeholder="Add a task and press Enter…"
        className="border-0 shadow-none focus-visible:ring-0 px-0 h-auto py-1 text-base"
      />
    </div>
  );
}
