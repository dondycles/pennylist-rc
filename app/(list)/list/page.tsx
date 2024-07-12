"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Icons
import { ArrowDown, ArrowUp, Equal, Plus } from "lucide-react";
import { TbCurrencyPeso } from "react-icons/tb";

// Importing utility functions
import { UseAmountFormat } from "@/lib/utils";

// Importing actions
import { getMoneys, getTotal } from "@/app/_actions/moneys";
import { getLogs } from "@/app/_actions/logs";

// Importing UI components
import { Button } from "@/components/ui/button";

// Importing state management
import { useListState } from "@/store";

// Importing custom components
import AddMoneyForm from "@/components/forms/add-money-form";
import EditMoneyForm from "@/components/forms/edit-money-form";
import Money from "@/components/list-money";
import TotalBreakdownPieChart from "@/components/charts/list-total-breakdown-pie-chart";
import DailyProgressBarChart from "@/components/charts/list-daily-progress-bar-chart";

// Importing types
import type { Database } from "@/database.types";

import { Separator } from "@/components/ui/separator";

import { AnimatePresence, motion } from "framer-motion";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import Scrollable from "@/components/scrollable";
import FormsDrawer from "@/components/forms/forms-drawer";
import { calculateListChartsData } from "@/lib/hooks";
import LogsDataTable from "@/components/charts/log-data-table";
import { logsColumns } from "@/components/charts/log-columns";
import MonthlyProgressBarChart from "@/components/charts/list-monthly-progress-bar-chart";
import { useListDataContext } from "@/components/auth-provider";
import SkeletonLoading from "@/components/skeleton";

export default function ListPage() {
  const { list, isLoading } = useListDataContext();
  const listState = useListState();
  const [animated, setAnimated] = useState(false);
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
    queryKey: ["moneys", listState.sort, list?.id],
    queryFn: async () => await getMoneys(listState.sort),
    enabled: list !== undefined && !isLoading,
  });

  const {
    data: totalData,
    isLoading: totalLoading,
    refetch: refetchTotal,
  } = useQuery({
    queryKey: ["total", list?.id],
    queryFn: async () => await getTotal(),
    enabled: list !== undefined && !isLoading,
  });

  const total = totalData?.data ?? 0;

  const {
    data: logs,
    error: logsError,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["logs", list?.id],
    queryFn: async () => await getLogs(),
    enabled: list !== undefined && !isLoading,
  });

  const { monthlyProgress, differences, dailyProgress, modifiedLogs } =
    calculateListChartsData({
      logs: logs?.data ?? [],
      logsLoading: logsLoading,
      total: total,
    });

  const refetch = () => {
    refetchMoneys();
    refetchLogs();
    refetchTotal();
  };

  const loaded = !moneysLoading && !logsLoading && !totalLoading && !isLoading;

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

  if (!loaded) return <SkeletonLoading />;

  return (
    <Scrollable>
      {/* total money and add money form */}
      <motion.div layout className="flex flex-col gap-2">
        <div className="mt-2 border rounded-lg p-4 flex flex-row gap-4 items-center justify-between shadow-lg">
          <div className="flex flex-col min-w-0">
            <p className="text-muted-foreground text-xs flex items-center gap-1 w-fit">
              Total Money of {list?.listname}
            </p>
            <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
              <TbCurrencyPeso className="shrink-0" />
              <p className="truncate  font-bold">
                {UseAmountFormat(total ?? 0, {
                  hide: listState.hideAmounts,
                  sign: false,
                })}
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
              <motion.div
                transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                whileTap={{ scale: 0.8 }}
              >
                <Button size={"icon"} className="rounded-full shrink-0">
                  <Plus />
                </Button>
              </motion.div>
            }
            form={
              <AddMoneyForm
                currentTotal={total}
                close={() => {
                  setShowAddMoneyForm(false);
                  refetch();
                }}
              />
            }
          />
        </div>
      </motion.div>
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
        <motion.div
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          layout
          animate={{ height: 50 * Number(moneys?.data?.length) - 8 }}
          className="w-full flex flex-col"
        >
          <AnimatePresence>
            {moneys?.data?.map((money, i) => {
              return (
                <motion.div
                  key={money.id + i}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 42, marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{
                    type: "spring",
                    duration: 1,
                    bounce: 0.5,
                    delay: animated ? 0 : i / 6,
                    stiffness: 200,
                  }}
                  onAnimationStart={() => {
                    if (animated) return;
                    if (i === moneys.data.length - 1)
                      setTimeout(
                        () => setAnimated(true),
                        (moneys.data.length / 6) * 1000,
                      );
                  }}
                >
                  <Money
                    edit={() => {
                      setEditMoneyForm({ money: money, open: true });
                    }}
                    done={() => {
                      refetch();
                    }}
                    money={money}
                    hideAmounts={listState.hideAmounts}
                    currentTotal={String(total)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {logs?.data?.length ? (
        <motion.div
          initial={{ opacity: 0, y: -60 }}
          animate={animated ? { opacity: 1, y: 0 } : { opacity: 0, y: -60 }}
          className="flex flex-col gap-2"
          transition={{ type: "spring", duration: 1, bounce: 0.5 }}
          layout
        >
          <Separator className="mt-14" />
          {/* bars */}
          <div className="flex flex-col sm:flex-row gap-2">
            {dailyProgress ? (
              <DailyProgressBarChart
                differences={differences}
                dailyProgress={dailyProgress}
              />
            ) : null}
            {monthlyProgress ? (
              <MonthlyProgressBarChart monthlyProgress={monthlyProgress} />
            ) : null}
          </div>
          {/* pie */}
          {moneys?.data ? (
            <TotalBreakdownPieChart moneys={moneys.data} />
          ) : null}
          {/* tables */}
          {modifiedLogs && (
            <LogsDataTable columns={logsColumns} data={modifiedLogs} />
          )}
        </motion.div>
      ) : null}
    </Scrollable>
  );
}
