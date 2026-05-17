"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, List } from "@/lib/db";

export function useLists(): List[] {
  const value = useLiveQuery(
    async () => {
      const all = await db.lists.toArray();
      return all.filter((l) => !l.archived).sort((a, b) => a.order - b.order);
    },
    [],
    [] as List[]
  );
  return value ?? [];
}

export function useList(id: string | null): List | undefined {
  return useLiveQuery(
    async () => (id ? await db.lists.get(id) : undefined),
    [id]
  );
}
