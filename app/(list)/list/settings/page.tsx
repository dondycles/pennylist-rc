"use client";
import { useListDataContext } from "@/components/auth-provider";
import Scrollable from "@/components/scrollable";
import SkeletonLoading from "@/components/skeleton";

export default function ListSettings() {
  const { list, isLoading } = useListDataContext();

  if (isLoading) return <SkeletonLoading />;
  return (
    <Scrollable>
      {list?.listname}
      {list?.created_at}
    </Scrollable>
  );
}
