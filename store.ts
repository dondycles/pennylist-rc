import { persist } from "zustand/middleware";
import { create } from "zustand";

type listPage = {
  sort: {
    asc: boolean;
    by: "created_at" | "amount";
  };
  setSort: (asc: boolean, by: "created_at" | "amount") => void;
};

export const useListState = create<listPage>()(
  persist(
    (set, get) => ({
      sort: {
        asc: false,
        by: "created_at",
      },
      setSort: (asc, by) => set(() => ({ sort: { asc, by } })),
    }),
    { name: "list-page" }
  )
);
