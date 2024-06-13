"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Icons
import { Eye, EyeOff, ListFilter, Loader2, Plus } from "lucide-react";
import { TbCurrencyPeso } from "react-icons/tb";

// Importing utility functions
import { AsteriskNumber, UsePhpPeso } from "@/lib/utils";

// Importing actions
import { getMoneys } from "@/app/actions/moneys";
import { getLogs } from "@/app/actions/logs";

// Importing UI components
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Importing state management
import { useListState } from "@/store";

// Importing custom components
import AddMoneyForm from "./add-money-form";
import EditMoneyForm from "./edit-money-form";
import Money from "./money";
import TotalBreakdownPieChart from "./total-breakdown-pie-chart";
import LogsTable from "./logs-table";
import DailyTotalBarChart from "./daily-total-bar-chart";
import MonthlyTotalBarChart from "./monthly-total-bar-chart";

// Importing types
import { type Database } from "@/database.types";
import { type User } from "@supabase/supabase-js";

type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};
export default function List({ user }: { user: User }) {
  const [mounted, setMounted] = useState(false);
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

  const {
    data: moneys,
    error: moneysError,
    isLoading,
    refetch: refetchMoneys,
  } = useQuery({
    queryKey: ["moneys", listState.sort, user.id],
    queryFn: async () => await getMoneys(listState.sort),
  });
  const total = _.sum(moneys?.data?.map((money) => money.amount));

  const {
    data: logs,
    error: logsError,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["logs", user.id],
    queryFn: async () => await getLogs(),
  });

  const getDailyTotal = (days: number = 365) => {
    if (!mounted) return [];
    if (logsLoading) return [];

    const groupedByDate: {
      [key: string]: number;
    } = {};

    logs?.data?.toReversed().forEach((log) => {
      const date = new Date(log.created_at).toDateString();
      const total = Number((log.changes as changes).to.total);

      // sets the log's date as the key, and overwrites its total to most recent reocrd if there are many records in that date
      groupedByDate[date] = total;
    });

    const eachDayTotal: { date: string; total: number }[] = [];
    const currentDate = new Date();
    let lastTotal = 0;

    // sets the current date back based on the days parameter
    currentDate.setDate(currentDate.getDate() - days);

    for (let i = 0; i <= days; i++) {
      const day = currentDate.toDateString();

      if (groupedByDate[day] !== undefined) {
        // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
        lastTotal = groupedByDate[day];
      }

      eachDayTotal.push({ date: day, total: lastTotal });

      // sets the date to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayTotal;
  };

  const getMonthlyTotal = () => {
    if (!mounted) return [];
    if (logsLoading) return [];
    const year = new Date().getFullYear();
    const groupedByMonth: { total: number; date: string }[] = [];

    for (let i = 0; i < 12; i++) {
      const thisMonthsTotal = getDailyTotal(365).findLast(
        (day) =>
          new Date(day.date).getMonth() === i &&
          new Date(day.date).getFullYear() === year
      );

      groupedByMonth[i] = {
        total: thisMonthsTotal?.total ?? 0,
        date: `${i}-${year}`,
      };
    }
    return groupedByMonth;
  };

  const dailyTotal = getDailyTotal();
  const monthlyTotal = getMonthlyTotal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;

  if (moneys?.error || moneysError || logsError || logs?.error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {moneys?.error && moneys.error.message}
          {moneysError && moneysError.message}
          {logs?.error && logs.error}
          {logsError && logsError.message}
        </div>
      </main>
    );
  if (isLoading || logsLoading)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-muted-foreground gap-2 justify-center">
          Loading... <Loader2 className="animate-spin" />
        </div>
      </main>
    );

  return (
    <main className="w-full h-full px-2">
      <ScrollArea className="max-w-[800px] mx-auto h-full">
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
                  currentTotal={total}
                  close={() => {
                    setShowAddMoneyForm(false);
                    refetchMoneys();
                    refetchLogs();
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
              currentTotal={total}
              money={showEditMoneyForm.money!}
              close={() => {
                setEditMoneyForm((prev) => ({
                  ...prev,
                  open: false,
                }));
                refetchMoneys();
                refetchLogs();
              }}
            />
          </DrawerContent>
        </Drawer>
        {/* moneys list */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {moneys?.data?.map((money) => {
            return (
              <Money
                edit={() => setEditMoneyForm({ money: money, open: true })}
                done={() => {
                  refetchLogs();
                  refetchMoneys();
                }}
                money={money}
                key={money.id}
                hideAmounts={listState.hideAmounts}
                currentTotal={total}
              />
            );
          })}
        </div>
        {/* tables */}
        {logs?.data && <LogsTable logs={logs?.data} />}
        {/* pie */}
        {moneys?.data && moneys.data.length ? (
          <TotalBreakdownPieChart moneys={moneys.data} />
        ) : null}
        {/* bars */}
        <DailyTotalBarChart
          dailyTotal={dailyTotal.slice(
            dailyTotal.length - listState.dailyTotalDays,
            dailyTotal.length
          )}
        />
        <MonthlyTotalBarChart monthlyTotal={monthlyTotal} />
      </ScrollArea>
    </main>
  );
}
