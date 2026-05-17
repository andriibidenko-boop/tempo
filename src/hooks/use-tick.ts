"use client";

import { useEffect, useState } from "react";

/**
 * Re-renders the component every `intervalMs` ms.
 * Used to drive timer displays. Uses Date.now() for accuracy
 * so we never drift, even when the tab is throttled.
 */
export function useTick(intervalMs = 250, enabled = true) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setTick((n) => n + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled]);
}
