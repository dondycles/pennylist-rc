"use client";
import {
  deleteMoney,
  getMoney,
  getTotal,
  setColor,
} from "@/app/actions/moneys";
import Scrollable from "@/components/scrollable";
import { Skeleton } from "@/components/ui/skeleton";
import { AsteriskNumber, UsePhpPeso, UsePhpPesoWSign } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { TbCurrencyPeso } from "react-icons/tb";
import LogsTable from "./charts/money-logs-table";
import { Check, Palette, Pencil, Trash, X } from "lucide-react";
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

export default function Money({
  list,
  moneyId,
}: {
  list: User;
  moneyId: string;
}) {
  const [openPalette, setOpenPalette] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const listState = useListState();
  const {
    data: money,
    isLoading: moneyLoading,
    error: moneyError,
    refetch: refetchMoney,
  } = useQuery({
    queryKey: ["money", moneyId, list.id],
    queryFn: async () => await getMoney(moneyId),
  });

  const {
    data: totalData,
    isLoading: totalLoading,
    refetch: refetchTotal,
    error: totalError,
  } = useQuery({
    queryKey: ["total", list.id],
    queryFn: async () => await getTotal(),
  });

  const logs = money?.data?.logs;
  const total = totalData?.data ?? 0;
  const lastUpdate = logs?.toReversed().findLast((log) => log)?.created_at;

  const handleSetColor = async (color: string) => {
    setOpenPalette(false);
    if (!money?.data) return;
    const { error } = await setColor(money.data, color);
    if (error) console.log(error);
    refetchMoney();
  };

  const handleDelete = async () => {
    setIsPending(true);
    const { error } = await deleteMoney(money?.data!, String(total));
    if (error) return setIsPending(false);
    refetchMoney();
  };

  const getProgress = () => {
    if (!logs) return [];
    let groupedByDate: { [key: string]: number } = {};

    logs.toReversed().forEach((log) => {
      const date = new Date(log.created_at).toDateString();
      groupedByDate[date] = Number(log.changes?.to.amount);
    });

    let eachDayTotal: { date: string; total: number }[] = [];
    const currentDate = new Date();
    let lastTotal = 0;

    currentDate.setDate(currentDate.getDate() - 28);

    for (let i = 0; i <= 28; i++) {
      const day = currentDate.toDateString();

      if (groupedByDate[day] !== undefined) {
        // if this date has total, set it to lastTotal so the next dates that does not have total will get that total as well to fill up the bars
        lastTotal = groupedByDate[day];
      }

      eachDayTotal.push({ date: day, total: lastTotal });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayTotal;
  };
  const progress = getProgress();

  if (moneyError || money?.error || totalError || totalData?.error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {money?.error && money?.error?.message}
          {moneyError && moneyError?.message}
          {totalData?.error && totalData?.error?.message}
          {totalError && totalError?.message}
        </div>
      </main>
    );
  if (moneyLoading || totalLoading)
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
  if (!money?.data)
    return (
      <main className="w-full h-full p-2">
        <p className="text-xs text-muted-foreground text-center">
          Money not found.
        </p>
      </main>
    );

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
            {money.data.name}
          </p>
          <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
            <TbCurrencyPeso className="shrink-0" />
            <p className="truncate font-bold ">
              {" "}
              {listState.hideAmounts
                ? AsteriskNumber(money.data.amount ?? 0)
                : UsePhpPeso(money.data.amount ?? 0)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-fit shrink-0 z-10">
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
                currentTotal={String(total)}
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
                  <div className="font-semibold font-anton flex items-center">
                    <TbCurrencyPeso />
                    {listState.hideAmounts
                      ? AsteriskNumber(money.data.amount ?? 0)
                      : UsePhpPeso(money.data.amount ?? 0)}
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
          {((Number(money.data.amount) / total) * 100).toFixed(2)}% of your
          total money ({UsePhpPesoWSign(total)})
        </p>
      </div>

      {logs?.length !== 0 ? (
        <>
          {progress.length !== 0 ? (
            <ProgressBarChart progress={progress} />
          ) : null}
          {logs && <LogsTable logs={logs} />}
        </>
      ) : null}
    </Scrollable>
  );
}
