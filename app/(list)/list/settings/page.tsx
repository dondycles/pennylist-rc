"use client";
import {
  changeListName,
  changeListPassword,
  deleteList,
  getList,
} from "@/app/_actions/auth";
import Scrollable from "@/components/scrollable";
import SkeletonLoading from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const changeListNameSchema = z.object({
  listname: z
    .string()
    .min(6, { message: "Listname must be at least 6 characters." }),
});

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export default function ListSettings() {
  const { toast } = useToast();
  const [settingsMode, setSettingsMode] = useState<{
    mode: "pass" | "listname" | "del" | null;
    isLoading: boolean;
    confirmListname: string;
  }>({ mode: null, isLoading: false, confirmListname: "" });

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
    setSettingsMode((prev) => ({ ...prev, isLoading: true }));
    const res = await changeListName(values, listData.data.id);
    setSettingsMode((prev) => ({ ...prev, isLoading: false }));

    if (res.error)
      return changeListNameForm.setError("listname", {
        message: res.error.replace("email address", "listname"),
      });
    changeListNameForm.reset();
    refetchListData();
    setSettingsMode((prev) => ({ ...prev, mode: null }));
    toast({
      title: "Listname changed",
      duration: 2000,
    });
  };

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const handleChangePassword = async (
    values: z.infer<typeof changePasswordSchema>,
  ) => {
    if (!listData?.data) return;
    setSettingsMode((prev) => ({ ...prev, isLoading: true }));
    const res = await changeListPassword(values, listData.data.id);
    setSettingsMode((prev) => ({ ...prev, isLoading: false }));

    if (res.error) {
      return changePasswordForm.setError("password", {
        message: res.error,
      });
    }
    changePasswordForm.reset();
    refetchListData();
    setSettingsMode((prev) => ({ ...prev, mode: null }));
    toast({
      title: "Password changed",
      duration: 2000,
    });
  };

  const handleDeleteList = async () => {
    if (!listData?.data) return;
    setSettingsMode((prev) => ({ ...prev, isLoading: true }));
    if (settingsMode.confirmListname !== listData.data.listname)
      return setSettingsMode((prev) => ({ ...prev, isLoading: false }));
    await deleteList(listData.data.id);
    setSettingsMode((prev) => ({
      ...prev,
      confirmListname: "",
    }));
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
              <span>
                List created at{" "}
                {new Date(listData.data.created_at).toLocaleString()}
              </span>
              <span hidden={!listData.data.last_pass_changed}>
                {"Password changed last: " +
                  new Date(listData.data.last_pass_changed!).toLocaleString()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 flex flex-col gap-2">
            {!settingsMode?.mode ? (
              <>
                <Button
                  onClick={() => {
                    setSettingsMode((prev) => ({ ...prev, mode: "listname" }));
                  }}
                  className="w-full"
                  variant={"secondary"}
                >
                  Change listname
                </Button>
                <Button
                  onClick={() => {
                    setSettingsMode((prev) => ({ ...prev, mode: "pass" }));
                  }}
                  className="w-full"
                  variant={"secondary"}
                >
                  Change password
                </Button>
                <Button
                  onClick={() => {
                    setSettingsMode((prev) => ({ ...prev, mode: "del" }));
                  }}
                  className="w-full"
                  variant={"destructive"}
                >
                  Delete list
                </Button>
              </>
            ) : (
              <>
                {settingsMode.mode === "listname" && (
                  <Form {...changeListNameForm}>
                    <form
                      onSubmit={changeListNameForm.handleSubmit(
                        handleChangeListName,
                      )}
                      className="flex flex-col gap-2 w-full"
                    >
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
                      <p className="text-xs text-muted-foreground">
                        Please don&apos;t put spaces.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          disabled={settingsMode.isLoading}
                          type="submit"
                          className="flex-1"
                          variant={"secondary"}
                        >
                          Confirm
                        </Button>
                        <Button
                          disabled={settingsMode.isLoading}
                          type="button"
                          onClick={() => {
                            setSettingsMode((prev) => ({
                              ...prev,
                              mode: null,
                            }));
                            changeListNameForm.reset();
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                      <Separator />
                    </form>
                  </Form>
                )}
                {settingsMode.mode === "pass" && (
                  <Form {...changePasswordForm}>
                    <form
                      onSubmit={changePasswordForm.handleSubmit(
                        handleChangePassword,
                      )}
                      className="flex flex-col gap-2 w-full"
                    >
                      <FormField
                        control={changePasswordForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="New password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button
                          disabled={settingsMode.isLoading}
                          type="submit"
                          className="flex-1"
                          variant={"secondary"}
                        >
                          Confirm
                        </Button>
                        <Button
                          disabled={settingsMode.isLoading}
                          type="button"
                          onClick={() => {
                            setSettingsMode((prev) => ({
                              ...prev,
                              mode: null,
                            }));
                            changeListNameForm.reset();
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                      <Separator />
                    </form>
                  </Form>
                )}
                {settingsMode.mode === "del" && (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={settingsMode.confirmListname as string}
                      onChange={(e) =>
                        setSettingsMode((prev) => ({
                          ...prev,
                          confirmListname: e.target.value,
                        }))
                      }
                      placeholder="Listname"
                    />
                    <div className="flex gap-2 ">
                      <Button
                        disabled={settingsMode.isLoading}
                        onClick={handleDeleteList}
                        className="flex-1"
                        variant={"destructive"}
                      >
                        Confirm Delete
                      </Button>
                      <Button
                        disabled={settingsMode.isLoading}
                        onClick={() => {
                          setSettingsMode((prev) => ({
                            ...prev,
                            confirmListname: "",
                            mode: null,
                          }));
                        }}
                        className="flex-1"
                      >
                        No
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </Scrollable>
    );
}
