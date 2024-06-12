"use client";
import { getMoneys } from "@/app/actions/moneys";
import { useQuery } from "@tanstack/react-query";
import AddMoneyForm from "./add-money-form";

import { AsteriskNumber, UsePhpPeso } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ListFilter, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Money from "./money";
import { Database } from "@/database.types";
import EditMoneyForm from "./edit-money-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
            <div className="flex flex-col min-w-0">
              <div className="text-muted-foreground text-xs flex items-center gap-1 w-fit">
                Total Money{" "}
                <button onClick={() => listState.toggleHideAmounts()}>
                  {!listState.hideAmounts ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate">
                <TbCurrencyPeso className="shrink-0" />
                <p className="truncate">
                  {listState.hideAmounts
                    ? AsteriskNumber(total)
                    : UsePhpPeso(total)}
                </p>
              </div>
            </div>
            <Drawer open={showAddMoneyForm} onOpenChange={setShowAddMoneyForm}>
              <DrawerTrigger asChild>
                <Button size={"icon"} className="rounded-full shrink-0">
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
              <DropdownMenuCheckboxItem
                checked={listState.sort.by === "amount"}
                onClick={() => {
                  listState.setSort(listState.sort.asc, "amount");
                }}
              >
                Amount
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.sort.by === "created_at"}
                onClick={() => {
                  listState.setSort(listState.sort.asc, "created_at");
                }}
              >
                Date created
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={listState.sort.asc}
                onClick={() => {
                  listState.setSort(true, listState.sort.by);
                }}
              >
                Ascending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={!listState.sort.asc}
                onClick={() => {
                  listState.setSort(false, listState.sort.by);
                }}
              >
                Descending
              </DropdownMenuCheckboxItem>
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
        <div className="w-full flex flex-col gap-2 mt-2 mb-24">
          {moneys?.map((money) => {
            return (
              <Money
                edit={() => setEditMoneyForm({ money: money, open: true })}
                done={() => refetch()}
                money={money}
                key={money.id}
                hideAmounts={listState.hideAmounts}
              />
            );
          })}
        </div>
      </ScrollArea>
    </main>
  );
}
