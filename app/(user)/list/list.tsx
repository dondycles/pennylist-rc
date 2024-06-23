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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};
export default function List({ list }: { list: User }) {
  var _ = require("lodash");
  const listState = useListState();
  const { isLastDayOfMonth } = require("date-fns");
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
    isLoading: moneysLoading,
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

  const getDailyTotal = () => {
    if (logsLoading) return [];
    const groupedByDate: {
      [key: string]: number;
    } = {};
    const days: number = 365;
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

      if (i === days) {
        lastTotal = total;
      } else if (groupedByDate[day] !== undefined) {
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

    if (listState.monthlyTotalBy === "last") {
      // iterated by the number of months

      // starts at +1 of the current month of last year
      let month = new Date().getMonth() + 1;
      for (let i = 0; i < 12; i++) {
        // if its the last month back to first month of the current year
        if (month === 12) month = 0;
        // get the last data of the month
        const monthsTotal = dailyTotal?.findLast(
          (day) =>
            // gets data equal to month and year or last year at least
            new Date(day.date).getMonth() === month &&
            (new Date(day.date).getFullYear() === year ||
              new Date(day.date).getFullYear() === year - 1)
        );

        // inserts the data to an object i or no. of month as the key
        groupedByMonth[i] = {
          // if the i is equal to current month, gets the current total instead for more accuracy
          total: i === month ? total : monthsTotal?.total!,
          date: monthsTotal?.date!,
        };

        month += 1;
      }
    }

    if (listState.monthlyTotalBy === "avg") {
      let average = [0];
      // starts at +1 of the current month of last year
      let month = new Date().getMonth() + 1;
      // iterated by the number of months
      for (let i = 0; i < 12; i++) {
        // if its the last month back to first month of the current year
        if (month === 12) month = 0;
        // gets the last Date
        let lastDay: string;

        dailyTotal
          .filter(
            (day) =>
              new Date(day.date).getMonth() === month &&
              (new Date(day.date).getFullYear() === year ||
                new Date(day.date).getFullYear() === year - 1)
          )
          .map((day) => {
            if (new Date(day.date).getDate() === 1) average = [0];
            // pushes each day total but resets if its the first day
            average.push(day.total);

            // if it is last day, sets the lastDay
            if (isLastDayOfMonth(new Date(day.date))) lastDay = day.date;
          });
        // sets the data for (i)month
        groupedByMonth[i] = {
          total: !isNaN(_.mean(average.filter((avg) => avg !== 0)))
            ? _.mean(average.filter((avg) => avg !== 0))
            : 0,
          date: lastDay!,
        };
        month += 1;
      }
    }

    const sortedByMonth: { total: number; date: string }[] = [];
    groupedByMonth.forEach((monthData, i) => {
      if (new Date(monthData.date).getMonth() <= month) {
        sortedByMonth[i] = {
          total: monthData.total ?? 0,
          date: new Date(monthData.date).toDateString(),
        };
      } else {
        sortedByMonth[i] = {
          total: monthData.total ?? 0,
          date: new Date(monthData.date).toDateString(),
        };
      }
    });
    return sortedByMonth;
  };

  const getDiffFromYesterday = () => {
    const result = (
      ((total - dailyTotal[dailyTotal.length - 1].total) / total) *
      100
    ).toFixed(1);
    return {
      text: `${result}%`,
      isUp: Boolean(Number(result) > 0),
      isZero: Boolean(Number(result) === 0),
    };
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

  if (moneysLoading || logsLoading)
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
                <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
                  <TbCurrencyPeso className="shrink-0" />
                  <p className="truncate">{UsePhpPeso(total)}</p>
                  <TooltipProvider delayDuration={250}>
                    <Tooltip>
                      <TooltipTrigger
                        className={`text-sm mb-auto mt-0 font-bold ${
                          getDiffFromYesterday().isZero
                            ? "text-muted-foreground"
                            : getDiffFromYesterday().isUp
                            ? "text-green-500"
                            : "text-destructive"
                        }`}
                      >
                        {getDiffFromYesterday().text}
                      </TooltipTrigger>
                      <TooltipContent align="center" side="bottom">
                        Difference from yesterday&apos;s total is{" "}
                        <span
                          className={`text-sm mb-auto mt-0 font-bold ${
                            getDiffFromYesterday().isZero
                              ? "text-muted-foreground"
                              : getDiffFromYesterday().isUp
                              ? "text-green-500"
                              : "text-destructive"
                          }`}
                        >
                          {" "}
                          {getDiffFromYesterday().text}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
          <div>
            <Card className="rounded-lg">
              <CardHeader className="py-3 px-2">
                <CardTitle>Comparison</CardTitle>
              </CardHeader>
            </Card>
          </div>
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
              {dailyTotal ? (
                <DailyTotalBarChart
                  open={listState.showDailyTotal}
                  toggleOpen={() => listState.setShowDailyTotal()}
                  dailyTotal={dailyTotal.slice(
                    dailyTotal.length - listState.dailyTotalDays,
                    dailyTotal.length
                  )}
                />
              ) : null}
              {monthlyTotal ? (
                <MonthlyTotalBarChart
                  open={listState.showMonthlyTotal}
                  toggleOpen={() => listState.setShowMonthlyTotal()}
                  monthlyTotal={monthlyTotal}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </ScrollArea>
    </main>
  );
}
