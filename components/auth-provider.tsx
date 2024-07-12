"use client";
import { createContext, useContext } from "react";

import { Database } from "@/database.types";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getList } from "@/app/_actions/auth";

type ListDataContextTypes = {
  list: Database["public"]["Tables"]["lists"]["Row"] | undefined;
  isLoading: boolean;
  didNotMatch: boolean;
};

const ListDataContext = createContext<ListDataContextTypes>({
  isLoading: true,
  list: undefined,
  didNotMatch: false,
});

export function useListDataContext() {
  const listData = useContext(ListDataContext);

  if (!listData.isLoading && listData.didNotMatch)
    throw Error(`List id did not match!`);

  return listData;
}

export default function ListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const supabase = createClient();
      return (await supabase.auth.getUser()).data.user?.id;
    },
  });

  const { data: listData, isLoading: listLoading } = useQuery({
    enabled: session !== undefined,
    queryKey: ["list", session],
    queryFn: async () => getList(),
  });

  return (
    <ListDataContext.Provider
      value={{
        isLoading: listLoading || sessionLoading,
        list: listData?.list,
        didNotMatch: session !== listData?.list?.id,
      }}
    >
      {children}
    </ListDataContext.Provider>
  );
}
