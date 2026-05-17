import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  activeListId: string | null;
  isSidebarOpen: boolean;
  isComposerOpen: boolean;
  setActiveList: (id: string | null) => void;
  toggleSidebar: () => void;
  openComposer: () => void;
  closeComposer: () => void;
}

export const useUI = create<UIState>()(
  persist(
    (set, get) => ({
      activeListId: null,
      isSidebarOpen: true,
      isComposerOpen: false,
      setActiveList: (id) => set({ activeListId: id }),
      toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),
      openComposer: () => set({ isComposerOpen: true }),
      closeComposer: () => set({ isComposerOpen: false }),
    }),
    {
      name: "blitzit-ui",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeListId: state.activeListId,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);
