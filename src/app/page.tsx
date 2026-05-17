"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TaskList } from "@/components/task/task-list";
import { TaskComposer } from "@/components/task/task-composer";
import { StartFlowButton } from "@/components/timer/start-flow-button";
import { FloatingTimer } from "@/components/timer/floating-timer";

export default function Home() {
  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative">
        <Topbar />
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <TaskComposer />
            <TaskList />
          </div>
        </div>
        <StartFlowButton />
      </main>
      <FloatingTimer />
    </div>
  );
}
