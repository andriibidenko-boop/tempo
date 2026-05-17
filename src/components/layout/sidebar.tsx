"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Zap, BarChart3, Settings as SettingsIcon } from "lucide-react";
import { useLists } from "@/hooks/use-lists";
import { useUI } from "@/stores/ui-store";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const lists = useLists();
  const { activeListId, setActiveList, isSidebarOpen } = useUI();

  useEffect(() => {
    if (!activeListId && lists.length > 0) {
      setActiveList(lists[0].id);
    }
  }, [activeListId, lists, setActiveList]);

  const addList = async () => {
    const name = prompt("List name?");
    if (!name) return;
    await db.lists.add({
      id: crypto.randomUUID(),
      name,
      emoji: "📋",
      order: lists.length,
      archived: false,
      createdAt: Date.now(),
    });
  };

  if (!isSidebarOpen) return null;

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar text-sidebar-foreground flex flex-col">
      <div className="px-4 py-4 flex items-center gap-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"
        >
          <Zap className="w-5 h-5 fill-current" />
        </motion.div>
        <h1 className="text-lg font-bold tracking-tight">Blitzit</h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <div className="mb-4">
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Lists
          </div>
          <div className="space-y-0.5 mt-1">
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setActiveList(list.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center gap-2",
                  activeListId === list.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "hover:bg-sidebar-accent/50"
                )}
              >
                <span>{list.emoji}</span>
                <span className="truncate">{list.name}</span>
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={addList}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
              Add list
            </Button>
          </div>
        </div>
      </nav>

      <div className="px-2 py-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          Reports
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2"
        >
          <SettingsIcon className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
