"use client";
import {
  deleteMoney,
  getMoney,
  getTotal,
  setColor,
} from "@/app/actions/moneys";
import Scrollable from "@/components/scrollable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AsteriskNumber,
  UsePhpPeso,
  UsePhpPesoWSign,
  toMonthWord,
} from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { TbCurrencyPeso } from "react-icons/tb";
import LogsTable from "./logs-table";
import { Check, Palette, Pencil, Trash, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colors } from "@/constants/colors";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import EditMoneyForm from "@/app/(user)/list/_components/forms/edit-money-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Brush,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

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

  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = Number(isNaN(payload[0]?.value) ? 0 : payload[0]?.value);
      const predValue = Number(
        progress.find(
          (day) =>
            day.date ===
            new Date(
              new Date().setDate(
                new Date(payload[0].payload.date).getDate() - 1
              )
            ).toDateString()
        )?.total
      );
      const difference = isNaN(((value - predValue) / value) * 100)
        ? 0
        : ((value - predValue) / value) * 100;
      return (
        <div className="rounded-lg  p-2  text-sm bg-foreground text-background">
          <p> {payload[0].payload.date}</p>
          <p>{UsePhpPesoWSign(value)}</p>
          <p>
            <span
              className={
                difference === 0
                  ? "text-muted-foreground"
                  : difference > 0
                  ? "text-green-500"
                  : "text-red-400"
              }
            >
              {difference.toFixed(1)}%{" "}
            </span>
            {difference === 0 ? "equal" : difference > 0 ? "up" : "down"} than
            last day
          </p>
        </div>
      );
    }

    // return <div className="bg-black">{JSON.stringify(any)}</div>;

    return null;
  };

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
          "p-4 shadow-lg border rounded-lg flex flex-row justify-between items-center font-bold ease-in-out transition-all mt-2 relative overflow-hidden"
        }
      >
        <div className="flex flex-col min-w-0 z-10">
          <p className="text-xs flex items-center gap-1 w-fit">
            {money.data.name}
          </p>
          <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
            <TbCurrencyPeso className="shrink-0" />
            <p className="truncate">
              {" "}
              {listState.hideAmounts
                ? AsteriskNumber(money.data.amount ?? 0)
                : UsePhpPeso(money.data.amount ?? 0)}
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-fit shrink-0 z-10">
          <Drawer open={openEditForm} onOpenChange={setOpenEditForm}>
            <DrawerTrigger asChild>
              <button>
                <Pencil size={20} />
              </button>
            </DrawerTrigger>
            <DrawerContent className=" p-2 gap-2">
              <p className="font-bold text-sm text-center">Edit money</p>
              <EditMoneyForm
                close={() => {
                  setOpenEditForm(false);
                  refetchTotal();
                  refetchMoney();
                }}
                currentTotal={String(total)}
                money={money.data}
              />
            </DrawerContent>
          </Drawer>
          <Popover onOpenChange={setOpenPalette} open={openPalette}>
            <PopoverTrigger asChild>
              <button>
                <Palette size={20} />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="flex flex-row flex-wrap gap-1 p-1 max-w-[186px]"
            >
              {Object.values(colors).map((color, i) => {
                return (
                  <div className="flex flex-col gap-1" key={i}>
                    {Object.values(color).map((c) => {
                      return (
                        <button
                          onClick={() => handleSetColor(c)}
                          className="rounded bg-violet-100 size-4"
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
            <Card className="shadow-none rounded-lg">
              <CardHeader className="px-2 py-3">
                <CardTitle className="font-bold">
                  Progress (Last 7 days)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 h-fit w-full">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={progress} className="h-12">
                    <XAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toDateString() ===
                        new Date().toDateString()
                          ? "Today"
                          : new Date(value).getDate() === 1
                          ? `${toMonthWord(value)} ${new Date(
                              value
                            ).getFullYear()}`
                          : new Date(value).getDate().toString()
                      }
                    />
                    {/* <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(value) => UsePhpPesoWSign(value, 0)}
                  axisLine={false}
                /> */}
                    <Tooltip content={CustomTooltipDailyTotal} />
                    <Brush
                      dataKey="total"
                      height={30}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Bar
                      animationBegin={0}
                      dataKey="total"
                      fill="hsl(var(--foreground))"
                      radius={[4, 4, 0, 0]}
                      className="bg-red-500"
                    >
                      {progress.map((e) => (
                        <Cell
                          key={e.date}
                          style={{
                            fill: "hsl(var(--foreground))",
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : null}
          {logs && <LogsTable logs={logs} />}
        </>
      ) : null}
    </Scrollable>
  );
}
