"use client";

import { useEffect } from "react";
import { ensureDefaults } from "@/lib/db";

export function DbInit() {
  useEffect(() => {
    ensureDefaults().catch(console.error);
  }, []);
  return null;
}
