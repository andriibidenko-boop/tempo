"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useUI } from "@/stores/ui-store";
import { useTasks } from "@/hooks/use-tasks";
import { useTimer } from "@/stores/timer-store";

export function StartFlowButton() {
  const { activeListId } = useUI();
  const tasks = useTasks(activeListId);
  const startTimer = useTimer((s) => s.start);
  const activeTaskId = useTimer((s) => s.taskId);

  const firstOpen = tasks.find((t) => !t.completed);
  const disabled = !firstOpen || !!activeTaskId;

  const onStart = () => {
    if (!firstOpen) return;
    startTimer(
      firstOpen.id,
      firstOpen.estimateMinutes ? "est" : "tracking",
      firstOpen.estimateMinutes ? firstOpen.estimateMinutes * 60 : undefined
    );
  };

  return (
    <motion.div
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2"
    >
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.96 }}
        onClick={onStart}
        disabled={disabled}
        className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-shadow"
      >
        <Play className="w-5 h-5 fill-current" />
        START FLOW
      </motion.button>
    </motion.div>
  );
}
