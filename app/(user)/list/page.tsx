"use client";
import { getMoneys } from "@/app/actions/moneys";
import { useQuery } from "@tanstack/react-query";
import AddMoneyForm from "./add-money-form";

import { UsePhpPesoWSign } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ListFilter, Loader2, Plus } from "lucide-react";
import { useState } from "react";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Money from "./money";
import { Database } from "@/database.types";
import EditMoneyForm from "./edit-money-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export default function List() {
  var _ = require("lodash");
  const listState = useListState();
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showEditMoneyForm, setEditMoneyForm] = useState<{
    open: boolean;
    money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user"> | null;
  }>({
    open: false,
    money: null,
  });
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["moneys", listState.sort],
    queryFn: async () => await getMoneys(listState.sort),
  });
  const moneys = data?.data?.map((money) => money);
  const total = _.sum(moneys?.map((money) => money.amount));

  if (data?.error || error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {data?.error && data?.error.message}
          {error && error.message}
        </div>
      </main>
    );
  if (isLoading)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-muted-foreground gap-2 justify-center">
          Loading... <Loader2 className="animate-spin" />
        </div>
      </main>
    );

  return (
    <main className="w-full h-full px-2">
      <ScrollArea className="w-full h-full">
        {/* total money and add money form */}
        <div className="flex flex-col">
          <div className="mt-2 border rounded-lg p-4 shadow-lg flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col">
              <p className="text-muted-foreground text-xs">Total Money</p>
              <p className="text-2xl sm:text-4xl font-anton">
                {UsePhpPesoWSign(total)}
              </p>
            </div>
            <Drawer open={showAddMoneyForm} onOpenChange={setShowAddMoneyForm}>
              <DrawerTrigger asChild>
                <Button size={"icon"} className="rounded-full">
                  <Plus />
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" p-2 gap-2">
                <p className="font-bold text-sm text-center">Add money</p>
                <AddMoneyForm
                  close={() => {
                    setShowAddMoneyForm(false);
                    refetch();
                  }}
                />
              </DrawerContent>
            </Drawer>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs text-muted-foreground mt-8 ml-auto mr-0 flex items-center gap-1">
              <p>sort</p> <ListFilter size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    listState.setSort(listState.sort.asc, "amount");
                  }}
                >
                  Amount
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    listState.setSort(listState.sort.asc, "created_at");
                  }}
                >
                  Date created
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    listState.setSort(true, listState.sort.by);
                  }}
                >
                  Ascending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    listState.setSort(false, listState.sort.by);
                  }}
                >
                  Descending
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* edit money form */}
        <Drawer
          open={showEditMoneyForm.open}
          onOpenChange={(e) => {
            setEditMoneyForm((prev) => ({
              ...prev,
              open: e,
            }));
          }}
        >
          <DrawerContent className=" p-2 gap-2">
            <p className="font-bold text-sm text-center">Edit money</p>
            <EditMoneyForm
              money={showEditMoneyForm.money!}
              close={() => {
                setEditMoneyForm((prev) => ({
                  ...prev,
                  open: false,
                }));
                refetch();
              }}
            />
          </DrawerContent>
        </Drawer>

        {/* moneys list */}
        <div className="w-full flex flex-col gap-2 my-2">
          {moneys?.map((money) => {
            return (
              <Money
                edit={() => setEditMoneyForm({ money: money, open: true })}
                done={() => refetch()}
                money={money}
                key={money.id}
              />
            );
          })}
        </div>
      </ScrollArea>
    </main>
  );
}
