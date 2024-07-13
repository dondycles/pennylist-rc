"use client";
import { changeListName, deleteList, getList } from "@/app/_actions/auth";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const changeListNameSchema = z.object({
  listname: z
    .string()
    .min(6, { message: "Listname must be at least 6 characters." }),
});

export default function ListSettings() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [changeListnameMode, setChangeListnameMode] = useState(false);
  const [changingListname, setChangingListname] = useState(false);
  const [confirmListName, setConfirmListname] = useState<string>();
  const [deletingList, setDeletingList] = useState(false);

  const {
    data: listData,
    error: listDataError,
    isLoading: listDataLoading,
    refetch: refetchListData,
  } = useQuery({
    queryKey: ["list"],
    queryFn: async () => getList(),
  });

  const changeListNameForm = useForm<z.infer<typeof changeListNameSchema>>({
    resolver: zodResolver(changeListNameSchema),
    defaultValues: {
      listname: "",
    },
  });

  const handleChangeListName = async (
    values: z.infer<typeof changeListNameSchema>,
  ) => {
    if (!listData?.data) return;
    setChangingListname(true);
    const res = await changeListName(values, listData.data.id);
    setChangingListname(false);
    if (res.error)
      return changeListNameForm.setError("listname", {
        message: "Error changing listname. Spaces are not allowed.",
      });
    changeListNameForm.reset();
    refetchListData();
    setChangeListnameMode(false);
  };

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
            {changeListnameMode ? (
              <Form {...changeListNameForm}>
                <form
                  onSubmit={changeListNameForm.handleSubmit(
                    handleChangeListName,
                  )}
                  className="flex flex-col gap-2 w-full"
                >
                  <p className="text-sm text-muted-foreground">
                    Change listname
                  </p>
                  <FormField
                    control={changeListNameForm.control}
                    name="listname"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="New listname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button
                      disabled={changingListname}
                      type="submit"
                      className="flex-1"
                      variant={"secondary"}
                    >
                      Confirm
                    </Button>
                    <Button
                      disabled={changingListname}
                      type="button"
                      onClick={() => {
                        setChangeListnameMode(false);
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                  <Separator />
                </form>
              </Form>
            ) : (
              <Button
                onClick={() => {
                  setChangeListnameMode(true);
                }}
                className="w-full"
                variant={"secondary"}
              >
                Change listname
              </Button>
            )}

            <Button className="w-full" variant={"secondary"}>
              Change password
            </Button>
            <Button
              onClick={() => {
                setOpenDeleteDialog(true);
              }}
              className="w-full"
              variant={"destructive"}
            >
              Delete list
            </Button>
          </CardFooter>
        </Card>
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="w-fit p-2">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">
                Are you sure to delete?
              </DialogTitle>
              <DialogDescription className="text-center">
                Please type your listname{" "}
                <span className="font-black">{listData.data.listname}</span> for
                confirmation
              </DialogDescription>
              <Input
                value={confirmListName}
                onChange={(e) => setConfirmListname(e.target.value)}
                placeholder="Listname"
              />
              <div className="flex gap-2 ">
                <Button
                  disabled={deletingList}
                  onClick={async () => {
                    setDeletingList(true);
                    if (confirmListName !== listData.data.listname)
                      return setDeletingList(false);
                    await deleteList(listData.data.id);
                  }}
                  className="flex-1"
                  variant={"secondary"}
                >
                  Yes
                </Button>
                <Button
                  disabled={deletingList}
                  onClick={() => {
                    setOpenDeleteDialog(false);
                  }}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </Scrollable>
    );
}
