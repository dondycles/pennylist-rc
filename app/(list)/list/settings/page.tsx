"use client";
import { getList } from "@/app/_actions/auth";
import Scrollable from "@/components/scrollable";
import SkeletonLoading from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card className="rounded-lg mt-2">
          <CardHeader className="px-2 py-3">
            <CardTitle className="font- font-black text-2xl">
              {listData.data.listname}
            </CardTitle>
            <CardDescription>
              List created at{" "}
              {new Date(listData.data.created_at).toLocaleDateString()}
              {listData.data.last_pass_changed
                ? "Password changed last: " + listData.data.last_pass_changed
                : null}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p></p>
          </CardContent>
          <CardFooter className="p-2 flex-col gap-2">
            <Button className="w-full" variant={"ghost"}>
              Change password
            </Button>
            <Button className="w-full" variant={"destructive"}>
              Delete list
            </Button>
          </CardFooter>
        </Card>
      </Scrollable>
    );
}
