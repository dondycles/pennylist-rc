"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Icons
import {
  ArrowDown,
  ArrowDownNarrowWide,
  ArrowUp,
  ArrowUpNarrowWide,
  CalendarCheck,
  Equal,
  Gem,
  ListFilter,
  Plus,
} from "lucide-react";
import { TbCurrencyPeso } from "react-icons/tb";

// Importing utility functions
import { AsteriskNumber, UsePhpPeso } from "@/lib/utils";

// Importing actions
import { getMoneys, getTotal } from "@/app/actions/moneys";
import { getLogs } from "@/app/actions/logs";

// Importing UI components
import { Button } from "@/components/ui/button";

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
import Money from "./list-money";
import TotalBreakdownPieChart from "./charts/list-total-breakdown-pie-chart";
import LogsTable from "./charts/list-logs-table";
import DailyTotalBarChart from "./charts/list-daily-total-bar-chart";
import MonthlyTotalBarChart from "./charts/list-monthly-total-bar-chart";

// Importing types
import { type Database } from "@/database.types";
import { type User } from "@supabase/supabase-js";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Scrollable from "@/components/scrollable";
import FormsDrawer from "./forms/forms-drawer";
import { calculateListChartsData } from "@/lib/hooks";

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
    isLoading: moneysLoading,
    refetch: refetchMoneys,
  } = useQuery({
    queryKey: ["moneys", listState.sort, list.id],
    queryFn: async () => await getMoneys(listState.sort),
    enabled: list ? true : false,
  });

  const {
    data: totalData,
    isLoading: totalLoading,
    refetch: refetchTotal,
  } = useQuery({
    queryKey: ["total", list.id],
    queryFn: async () => await getTotal(),
  });

  const total = totalData?.data ?? 0;

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

  const { dailyTotal, monthlyTotal, differences } = calculateListChartsData({
    listState: listState,
    logs: logs?.data ?? [],
    logsLoading: logsLoading,
    total: total,
  });

  const refetch = () => {
    refetchMoneys();
    refetchLogs();
    refetchTotal();
  };

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

  if (moneysLoading || logsLoading || totalLoading)
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
    <Scrollable>
      {/* total money and add money form */}
      <div className="flex flex-col gap-8">
        <div className="mt-2 border rounded-lg p-4 flex flex-row gap-4 items-center justify-between shadow-lg">
          <div className="flex flex-col min-w-0">
            <p className="text-muted-foreground text-xs flex items-center gap-1 w-fit">
              Total Money
            </p>
            <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
              <TbCurrencyPeso className="shrink-0" />
              <p className="truncate  font-bold">
                {listState.hideAmounts
                  ? AsteriskNumber(total)
                  : UsePhpPeso(total)}
              </p>
              <TooltipProvider>
                <Tooltip delayDuration={250}>
                  <TooltipTrigger
                    className={`ml-1 text-xs mb-auto mt-0 font-bold flex items-center`}
                  >
                    <Badge
                      variant={"secondary"}
                      className={`font-bold px-1 flex items-center justify-center ${
                        differences.isZero.yesterday
                          ? "text-muted-foreground"
                          : differences.isUp.yesterday
                          ? "text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      {differences.isZero.yesterday ? (
                        <Equal className="size-3" />
                      ) : (
                        <>
                          <span>{differences.value.yesterday}</span>
                          {differences.isUp.yesterday ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )}
                        </>
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="bottom"
                    className="text-wrap w-fit max-w-[156px] p-2 text-sm"
                  >
                    <p>Today vs yesterday</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <FormsDrawer
            open={showAddMoneyForm}
            onOpenChange={setShowAddMoneyForm}
            title="Add money"
            desc="Add money by stating the name or its source and the amount."
            trigger={
              <Button size={"icon"} className="rounded-full shrink-0">
                <Plus />
              </Button>
            }
            form={
              <AddMoneyForm
                currentTotal={String(total)}
                close={() => {
                  setShowAddMoneyForm(false);
                  refetch();
                }}
              />
            }
          />
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
      <FormsDrawer
        open={showEditMoneyForm.open}
        onOpenChange={(e) => {
          setEditMoneyForm((prev) => ({
            ...prev,
            open: e,
          }));
        }}
        title="Edit money"
        desc="Any changes made are recorded to keep track of its progress."
        form={
          <EditMoneyForm
            currentTotal={String(total)}
            money={showEditMoneyForm.money!}
            close={() => {
              setEditMoneyForm((prev) => ({
                ...prev,
                open: false,
              }));
              refetch();
            }}
          />
        }
      />

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
                done={() => refetch()}
                money={money}
                key={money.id}
                hideAmounts={listState.hideAmounts}
                currentTotal={String(total)}
              />
            );
          })}
        </div>
      )}
      <Separator className="mt-14" />
      {logs?.data?.length ? (
        <>
          {/* bars */}
          {dailyTotal ? (
            <DailyTotalBarChart
              differences={differences}
              open={listState.showDailyTotal}
              toggleOpen={() => listState.setShowDailyTotal()}
              dailyTotal={dailyTotal}
            />
          ) : null}
          {monthlyTotal ? (
            <MonthlyTotalBarChart
              open={listState.showMonthlyTotal}
              toggleOpen={() => listState.setShowMonthlyTotal()}
              monthlyTotal={monthlyTotal}
            />
          ) : null}
          {/* pie */}
          {moneys?.data ? (
            <TotalBreakdownPieChart
              open={listState.showBreakdown}
              toggleOpen={() => listState.setShowBreakdown()}
              moneys={moneys.data}
            />
          ) : null}
          {/* tables */}
          {logs?.data && (
            <LogsTable
              open={listState.showLogs}
              toggleOpen={() => listState.setShowLogs()}
              logs={logs?.data}
            />
          )}
        </>
      ) : null}
    </Scrollable>
  );
}
