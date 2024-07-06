import { persist } from "zustand/middleware";
import { create } from "zustand";

export type ListState = {
  currentTotal: number;
  sort: {
    asc: boolean;
    by: "created_at" | "amount";
  };
  hideAmounts: boolean;
  dailyTotalDays: number;
  showLogs: boolean;
  showBreakdown: boolean;
  monthlyTotalBy: "last" | "avg";
  showAIDialog: boolean;
  lastAIOutput: string | null;
  setLastAIOutput: (ai: string) => void;
  setShowAIDialog: () => void;
  setCurrentTotal: (total: number) => void;
  setSort: (asc: boolean, by: "created_at" | "amount") => void;
  toggleHideAmounts: () => void;
  setDailyTotalDays: (days: number) => void;
  setMonthlyTotalBy: (by: "last" | "avg") => void;
  setShowLogs: () => void;
  setShowBreakdown: () => void;
};

export const useListState = create<ListState>()(
  persist(
    (set, get) => ({
      sort: {
        asc: false,
        by: "created_at",
      },
      setSort: (asc, by) => set(() => ({ sort: { asc, by } })),
      hideAmounts: false,
      toggleHideAmounts: () => set({ hideAmounts: !get().hideAmounts }),
      dailyTotalDays: 28,
      setDailyTotalDays: (days) => set(() => ({ dailyTotalDays: days })),
      showBreakdown: true,
      showLogs: true,
      monthlyTotalBy: "last",
      lastAIOutput: null,
      setLastAIOutput: (ai) => set(() => ({ lastAIOutput: ai })),
      setMonthlyTotalBy: (by) => set(() => ({ monthlyTotalBy: by })),
      setShowLogs: () => set({ showLogs: !get().showLogs }),
      setShowBreakdown: () => set({ showBreakdown: !get().showBreakdown }),
      currentTotal: 0,
      setCurrentTotal: (total) => set({ currentTotal: total }),
      showAIDialog: false,
      setShowAIDialog: () => set({ showAIDialog: !get().showAIDialog }),
    }),
    { name: "list-page" },
  ),
);
