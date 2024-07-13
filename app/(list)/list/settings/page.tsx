"use client";
import { getList } from "@/app/_actions/auth";
import Scrollable from "@/components/scrollable";
import SkeletonLoading from "@/components/skeleton";
import { useQuery } from "@tanstack/react-query";

export default function ListSettings() {
  const {
    data: listData,
    error: listDataError,
    isLoading: listDataLoading,
  } = useQuery({
    queryKey: ["list"],
    queryFn: async () => getList(),
  });

  if (listDataLoading) return <SkeletonLoading />;

  if (listDataError)
    throw new Error((listDataError && listDataError.message) || "Error");

  if (listData?.data)
    return (
      <Scrollable>
        <p>Listname: {listData?.data.listname}</p>
      </Scrollable>
    );
}
