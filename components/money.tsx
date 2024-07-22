"use client";
import {
  deleteMoney,
  getMoney,
  getMoneys,
  getTotal,
  setColor,
} from "@/app/_actions/moneys";
import Scrollable from "@/components/scrollable";
import { UseAmountFormat } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { TbCurrencyPeso } from "react-icons/tb";
import { ArrowLeftRight, Check, Palette, Pencil, Trash, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colors } from "@/lib/constants/colors";
import { useState } from "react";
import EditMoneyForm from "@/components/forms/edit-money-form";
import { useListState } from "@/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProgressBarChart from "./charts/money-progress-bar-chart";
import FormsDrawer from "./forms/forms-drawer";
import LogsDataTable from "./charts/log-data-table";
import { logsColumns } from "./charts/log-columns";
import { useToast } from "./ui/use-toast";
import { getList } from "@/app/_actions/auth";
import SkeletonLoading from "./skeleton";
import TransferMoneyForm from "./forms/transfer-money-form";
import type { ModifiedLogs, Progress, UUIDType } from "@/lib/types";
import { z } from "zod";

export default function Money({
  list,
  moneyId,
}: {
  list: User | null;
  moneyId: z.infer<typeof UUIDType>;
}) {
  const { toast } = useToast();
  let _ = require("lodash");
  const [openPalette, setOpenPalette] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openTransferForm, setOpenTransferForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const listState = useListState();

  const {
    data: listData,
    error: listDataError,
    isLoading: listDataLoading,
  } = useQuery({
    queryKey: ["list"],
    queryFn: async () => getList(),
    enabled: list !== null,
  });

  const {
    data: moneys,
    error: moneysError,
    isLoading: moneysLoading,
  } = useQuery({
    queryKey: ["moneys", listState.sort, listData?.data?.id],
    queryFn: async () =>
      await getMoneys(listState.sort, listData?.data?.id ?? ""),
    enabled: listData?.data !== null && listData?.data !== undefined,
  });

  const {
    data: money,
    isLoading: moneyLoading,
    error: moneyError,
    refetch: refetchMoney,
  } = useQuery({
    queryKey: ["money", moneyId, listData?.data?.id],
    queryFn: async () => await getMoney(moneyId),
    enabled: listData?.data !== null && listData?.data !== undefined,
  });

  const {
    data: totalData,
    isLoading: totalLoading,
    refetch: refetchTotal,
    error: totalError,
  } = useQuery({
    queryKey: ["total", listData?.data?.id],
    queryFn: async () => await getTotal(),
    enabled: listData?.data !== null && listData?.data !== undefined,
  });

  const total = totalData?.data ?? 0;
  const getModifiedLogs = () => {
    if (!money?.data) return [];
    // this is just for adding the "total"
    const modifiedLogs: ModifiedLogs[] = [];
    money?.data?.logs.forEach((log) => {
      modifiedLogs.push({
        ...log,
        total: Number(log.changes?.to.total ?? 0),
        money_name: log.moneys?.name,
      });
    });
    return modifiedLogs;
  };
  const logs = getModifiedLogs();
  const lastUpdate = logs?.toReversed().findLast((log) => log)?.created_at;

  const handleSetColor = async (color: string) => {
    if (!money?.data) return;
    setOpenPalette(false);
    const { error } = await setColor(money.data.id, color);
    if (error) {
      toast({
        title: "Error Editing Color",
        description: error,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    refetchMoney();
  };

  const handleDelete = async () => {
    if (!money?.data) return;
    setIsPending(true);
    const { error } = await deleteMoney(money.data, total);
    if (error) {
      toast({
        title: "Error Deleting Money",
        description: error,
        variant: "destructive",
        duration: 2000,
      });
      setIsPending(false);
      return;
    }
    refetchMoney();
  };

  const getProgress = () => {
    if (moneyLoading) return [];
    // all data will be coming from logs, since logs has all the movements in money

    // group each log by date, to also handle multiple logs in a single date.
    const groupedByDate: {
      [key: string]: Progress;
    } = {};

    // a temporary array for multiple logs in a single date
    let arrayOfLogsInASingleDate: {
      amount: number;
      reason: string;
      date: string;
    }[] = [];

    logs?.toReversed().forEach((log) => {
      //each log has a record of changes in a money, so it will be stored here for later use
      const changesInAmount =
        Number(log.changes?.to.amount) - Number(log.changes?.from.amount);

      const date = new Date(log.created_at).toDateString();

      // checks if this date has no data
      // if false, this means that this date is different from the previous iteration
      if (!groupedByDate[date]) {
        // clears the temporary array so that it can be filled up again by this date
        arrayOfLogsInASingleDate = [];
      }
      // then, pushes the data of the current log
      // if the previous iteration's date is similar to current, it just adds the data so it will become multiple logs for a single date
      arrayOfLogsInASingleDate.push({
        amount: changesInAmount ?? 0,
        reason: log.reason!,
        date: new Date(log.created_at).toDateString(),
      });

      // gets all the expenses by filtering only the negative values
      const expenses = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount < 0,
      );
      // gets all the expenses by filtering only the positive values
      const gains = arrayOfLogsInASingleDate.filter(
        (t) => t.amount !== 0 && t.amount > 0,
      );

      const expensesSum = _.sum(expenses.map((t) => t.amount));
      const gainsSum = _.sum(gains.map((t) => t.amount));

      // this sums up the changes happened in this date. ex. (100 + -100 + -25)
      // summing up all the positive and negative values
      // if negative, then there is a loss since loss are more than gains
      // if positive, then there is a gain since gains are more than loss
      const gainOrLoss = _.sum(arrayOfLogsInASingleDate.map((a) => a.amount));

      // saves the current date single/multiple logs.
      // if current date has an existing data, it just gets the current data of the tempory array
      groupedByDate[date] = {
        expenses,
        gains,
        date: date,
        expensesSum,
        gainsSum,
        gainOrLoss,
        // currentTotal will always get the very last record in each day
        currentTotal: Number(log.changes?.to.amount),
      };
    });

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 28);
    let previousProgress: Progress = {
      expenses: [],
      gains: [],
      date: "",
      expensesSum: 0,
      gainsSum: 0,
      gainOrLoss: 0,
      currentTotal: 0,
    };

    const eachDayData: Progress[] = [];

    for (let i = 0; i <= 28; i++) {
      const day = currentDate.toDateString();
      if (groupedByDate[day] !== undefined) {
        // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
        previousProgress = groupedByDate[day];
      } else {
        // if no data, resets everything except total
        previousProgress.gainOrLoss = 0;
        previousProgress.expenses = [];
        previousProgress.gains = [];
        previousProgress.date = day;
        previousProgress.expensesSum = 0;
        previousProgress.gainsSum = 0;
      }
      eachDayData.push({ ...previousProgress });
      // sets the date to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayData;
  };

  const progress = getProgress();
  if (
    moneyError ||
    totalError ||
    listDataError ||
    moneysError ||
    money?.error ||
    totalData?.error ||
    listData?.error ||
    moneys?.error
  )
    throw new Error(
      (moneyError && moneyError?.message) ||
        (totalError && totalError?.message) ||
        (listDataError && listDataError?.message) ||
        (moneysError && moneysError?.message) ||
        (money?.error && money?.error) ||
        (totalData?.error && totalData?.error?.message) ||
        (listData?.error && listData?.error?.message) ||
        (moneys?.error && moneys?.error?.message) ||
        "Error",
    );
  if (moneyLoading || totalLoading || listDataLoading || moneysLoading)
    return <SkeletonLoading />;

  if (money?.data && listData?.data && moneys?.data) {
    return (
      <Scrollable>
        <div
          style={{
            borderColor: money.data.color ?? "",
            color: money.data.color ?? "",
            backgroundColor: money.data.color ? money.data.color + 20 : "",
          }}
          className={
            "p-4 shadow-lg border rounded-lg flex flex-row justify-between items-center ease-in-out transition-all mt-2 relative overflow-hidden"
          }
        >
          <div className="flex flex-col min-w-0 z-10">
            <p className="text-xs flex items-center gap-1 w-fit">
              {money?.data?.name}
            </p>
            <div className="text-2xl sm:text-4xl font-readex flex flex-row items-center truncate -ml-1 sm:-ml-2">
              <TbCurrencyPeso className="shrink-0" />
              <p className="truncate font-bold ">
                {UseAmountFormat(Number(money?.data?.amount ?? 0), {
                  hide: listState.hideAmounts,
                  sign: false,
                })}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-fit shrink-0 z-10">
            <FormsDrawer
              open={openTransferForm}
              onOpenChange={setOpenTransferForm}
              title="Transfer money"
              desc="Any changes made are recorded to keep track of its progress."
              trigger={
                <button>
                  <ArrowLeftRight size={20} />
                </button>
              }
              form={
                <TransferMoneyForm
                  close={() => {
                    setOpenTransferForm(false);
                    refetchTotal();
                    refetchMoney();
                  }}
                  allMoneys={moneys.data}
                  currentTotal={total}
                  money={money.data}
                />
              }
            />
            <FormsDrawer
              open={openEditForm}
              onOpenChange={setOpenEditForm}
              title="Edit money"
              desc="Any changes made are recorded to keep track of its progress."
              trigger={
                <button>
                  <Pencil size={20} />
                </button>
              }
              form={
                <EditMoneyForm
                  close={() => {
                    setOpenEditForm(false);
                    refetchTotal();
                    refetchMoney();
                  }}
                  currentTotal={total}
                  money={money.data}
                />
              }
            />

            <Popover onOpenChange={setOpenPalette} open={openPalette}>
              <PopoverTrigger asChild>
                <button>
                  <Palette size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                className="flex flex-row flex-wrap gap-1 p-1 max-w-[186px]  bg-neutral-950  "
              >
                {Object.values(colors).map((color, i) => {
                  return (
                    <div className="flex flex-col gap-1" key={i}>
                      {Object.values(color).map((c) => {
                        return (
                          <button
                            onClick={() => handleSetColor(c)}
                            className="rounded size-4  hover:scale-125 scale-100 ease-in-out duration-150 transition-all"
                            style={{ backgroundColor: c }}
                            key={c}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </PopoverContent>
            </Popover>
            <Dialog open={showWarning} onOpenChange={setShowWarning}>
              <DialogTrigger asChild>
                <button>
                  <Trash size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="p-2 w-fit">
                <DialogHeader>
                  <DialogTitle className="text-destructive text-center font-black">
                    Warning!
                  </DialogTitle>
                  <DialogDescription className="text-center text-sm">
                    Are you sure to delete? <br /> This will also delete its log
                    history.
                  </DialogDescription>
                  <div
                    className={`p-2 border rounded-lg flex flex-row justify-between items-center font-bold ${
                      isPending && "opacity-50 pointer-events-none "
                    } ease-in-out transition-all`}
                  >
                    <p className="truncate">{money.data.name}</p>
                    <div className="font-semibold font-readex flex items-center">
                      <TbCurrencyPeso />
                      {UseAmountFormat(Number(money.data.amount ?? 0), {
                        hide: listState.hideAmounts,
                        sign: false,
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      disabled={isPending}
                      onClick={handleDelete}
                      className="flex-1"
                      variant={"destructive"}
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button
                      disabled={isPending}
                      onClick={() => setShowWarning(false)}
                      className="flex-1"
                      variant={"outline"}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mt-8">
          <p>Created at: {new Date(money.data.created_at).toLocaleString()}</p>
          {lastUpdate && (
            <p>Last update at: {new Date(lastUpdate).toLocaleString()}</p>
          )}
          <p>
            {((money.data.amount ?? 0 / total) * 100).toFixed(2)}% of your total
            money (
            {UseAmountFormat(total, {
              sign: true,
              hide: listState.hideAmounts,
            })}
            )
          </p>
        </div>

        {logs?.length !== 0 ? (
          <>
            {progress.length !== 0 ? (
              <ProgressBarChart progress={progress} />
            ) : null}
            {logs && <LogsDataTable data={logs} columns={logsColumns} />}
          </>
        ) : null}
      </Scrollable>
    );
  } else
    throw new Error(
      "Error finding " + (!money?.data && "moneys") ||
        (!listData?.data && "list") ||
        "data",
    );
}
