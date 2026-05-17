"use client";

import { Menu } from "lucide-react";
import { useLists } from "@/hooks/use-lists";
import { useUI } from "@/stores/ui-store";
import { useTasks } from "@/hooks/use-tasks";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";

export function Topbar() {
  const { toggleSidebar, activeListId } = useUI();
  const lists = useLists();
  const activeList = lists.find((l) => l.id === activeListId);
  const tasks = useTasks(activeListId);
  const completed = tasks.filter((t) => t.completed).length;

  return (
    <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background/80 backdrop-blur-sm">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="w-5 h-5" />
      </Button>
      <div className="flex-1">
        <h2 className="font-semibold flex items-center gap-2">
          {activeList?.emoji} {activeList?.name ?? "No list selected"}
        </h2>
        <p className="text-xs text-muted-foreground">
          {dayjs().format("dddd, MMM D")} · {completed}/{tasks.length} done
        </p>
      </div>
    </header>
  );
}
