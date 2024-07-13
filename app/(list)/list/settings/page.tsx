"use client";
<<<<<<< HEAD
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

  if (listData)
    return (
      <Scrollable>
        <p>Listname: {listData.listname}</p>
      </Scrollable>
    );
=======
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
>>>>>>> 0d41b68b72bd9866a8cda0db5b200b4284e95961
}
