"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarCheck,
  Eye,
  EyeOff,
  Gem,
  ListFilter,
  Plus,
} from "lucide-react";
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
import AddMoneyForm from "./forms/add-money-form";
import EditMoneyForm from "./forms/edit-money-form";
import Money from "./money";
import TotalBreakdownPieChart from "./charts/total-breakdown-pie-chart";
import LogsTable from "./charts/logs-table";
import DailyTotalBarChart from "./charts/daily-total-bar-chart";
import MonthlyTotalBarChart from "./charts/monthly-total-bar-chart";

// Importing types
import { type Database } from "@/database.types";
import { type User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};
export default function List({ list }: { list: User }) {
  var _ = require("lodash");
  const listState = useListState();

  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showEditMoneyForm, setEditMoneyForm] = useState<{
    open: boolean;
    money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "list"> | null;
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
    queryKey: ["moneys", listState.sort, list.id],
    queryFn: async () => await getMoneys(listState.sort),
    enabled: list ? true : false,
  });
  const total = _.sum(moneys?.data?.map((money) => money.amount));

  const {
    data: logs,
    error: logsError,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["logs", list.id],
    queryFn: async () => await getLogs(),
    enabled: list ? true : false,
  });

  const getDailyTotal = (days: number = 365) => {
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
    if (logsLoading) return [];
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const groupedByMonth: { total: number; date: string }[] = [];

    const dailyTotal = getDailyTotal(365);
    if (listState.monthlyTotalBy === "last") {
      // iterated by the number of months
      for (let i = 0; i < 12; i++) {
        // get the last data of the month
        const monthsTotal = dailyTotal.findLast(
          (day) =>
            new Date(day.date).getMonth() === i &&
            (new Date(day.date).getFullYear() === year ||
              new Date(day.date).getFullYear() === year - 1)
        );

        groupedByMonth[i] = {
          total: monthsTotal?.total ?? 0,
          date: monthsTotal?.date ?? "",
        };
      }
    }

    if (listState.monthlyTotalBy === "avg") {
      let average = [0];
      // iterated by the number of months
      for (let i = 0; i < 12; i++) {
        // get the last data of the month
        let monthsTotal:
          | {
              date: string;
              total: number;
            }
          | undefined;
        dailyTotal.map((day) => {
          if (new Date(day.date).getMonth() !== i) return;
          if (new Date(day.date).getDate() === 1) {
            average = [0];
          }
          average.push(day.total);
          if (
            new Date(day.date).getMonth() === i &&
            (new Date(day.date).getFullYear() === year ||
              new Date(day.date).getFullYear() === year - 1)
          )
            monthsTotal = day;
        });

        groupedByMonth[i] = {
          total: _.mean(average.filter((avg) => avg !== 0)) ?? 0,
          date: monthsTotal?.date ?? "",
        };
      }
    }

    const sortedByMonth: { total: number; date: string; order: number }[] = [];

    groupedByMonth.forEach((monthData, i) => {
      if (new Date(monthData.date).getMonth() <= month) {
        sortedByMonth[i] = {
          total: monthData.total,
          date: `${i}-${year}`,
          order: i + month - 1,
        };
      } else {
        sortedByMonth[i] = {
          total: monthData.total,
          date: `${i}-${year - 1}`,
          order: i - month - 1,
        };
      }
    });
    return sortedByMonth.sort((a, b) => a.order - b.order);
  };

  const dailyTotal = getDailyTotal();
  const monthlyTotal = getMonthlyTotal();

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
      <main className="w-full h-full">
        <div className=" max-w-[800px] mx-auto px-2 flex flex-col justify-start gap-2 mb-[5.5rem]">
          <Skeleton className="w-full h-24  max-w-[800px] mt-2" />
          <Skeleton className="w-full max-w-[800px] h-10 mt-8" />
          <Skeleton className="w-full max-w-[800px] h-10" />
          <Skeleton className="w-full max-w-[800px] h-10" />
        </div>
      </main>
    );

  return (
    <main className="w-full h-full">
      <ScrollArea className="w-full h-full">
        <div className=" max-w-[800px] mx-auto px-2 flex flex-col justify-start gap-2 mb-[5.5rem]">
          {/* total money and add money form */}
          <div className="flex flex-col gap-8">
            <div className="mt-2 border rounded-lg p-4 flex flex-row gap-4 items-center justify-between shadow-lg">
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
              <Drawer
                open={showAddMoneyForm}
                onOpenChange={setShowAddMoneyForm}
              >
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
              <DropdownMenuTrigger className="text-xs text-muted-foreground ml-auto mr-0 flex items-center gap-1 ">
                <p>sort</p> <ListFilter size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem
                  checked={listState.sort.by === "amount"}
                  onClick={() => {
                    listState.setSort(listState.sort.asc, "amount");
                  }}
                  className="text-xs"
                >
                  <Gem className="size-4 mr-1" />
                  Value
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={listState.sort.by === "created_at"}
                  onClick={() => {
                    listState.setSort(listState.sort.asc, "created_at");
                  }}
                  className="text-xs"
                >
                  <CalendarCheck className="size-4 mr-1" />
                  Date created
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={listState.sort.asc}
                  onClick={() => {
                    listState.setSort(true, listState.sort.by);
                  }}
                  className="text-xs"
                >
                  <ArrowUpNarrowWide className="size-4 mr-1" />
                  Ascending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={!listState.sort.asc}
                  onClick={() => {
                    listState.setSort(false, listState.sort.by);
                  }}
                  className="text-xs"
                >
                  <ArrowDownNarrowWide className="size-4 mr-1" />
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
          {total === 0 ? (
            <p className="text-sm text-center text-muted-foreground">
              You are currently pennyless
            </p>
          ) : (
            <div className="w-full flex flex-col gap-2">
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
          )}

          <Separator />
          {logs?.data?.length ? (
            <>
              {/* tables */}
              {logs?.data && (
                <LogsTable
                  open={listState.showLogs}
                  toggleOpen={() => listState.setShowLogs()}
                  logs={logs?.data}
                />
              )}
              {/* pie */}
              {moneys?.data ? (
                <TotalBreakdownPieChart
                  open={listState.showBreakdown}
                  toggleOpen={() => listState.setShowBreakdown()}
                  moneys={moneys.data}
                />
              ) : null}
              {/* bars */}
              <DailyTotalBarChart
                open={listState.showDailyTotal}
                toggleOpen={() => listState.setShowDailyTotal()}
                dailyTotal={dailyTotal.slice(
                  dailyTotal.length - listState.dailyTotalDays,
                  dailyTotal.length
                )}
              />
              <MonthlyTotalBarChart
                open={listState.showMonthlyTotal}
                toggleOpen={() => listState.setShowMonthlyTotal()}
                monthlyTotal={monthlyTotal}
              />
            </>
          ) : null}
        </div>
      </ScrollArea>
    </main>
  );
}
