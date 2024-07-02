"use client";
import { getMoney } from "@/app/actions/moneys";
import Scrollable from "@/components/scrollable";
import { Skeleton } from "@/components/ui/skeleton";
import { UsePhpPeso } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { TbCurrencyPeso } from "react-icons/tb";
import LogsTable from "./logs-table";

type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};
export default function Money({
  list,
  moneyId,
}: {
  list: User;
  moneyId: string;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["money", moneyId, list.id],
    queryFn: async () => await getMoney(moneyId),
  });
  const money = data?.data;
  const logs = data?.data?.logs;

  const getDailyTotal = () => {
    if (!logs) return [];
    let groupedByDate: { [key: string]: number } = {};

    logs.toReversed().forEach((log) => {
      const date = new Date(log.created_at).toDateString();

      const total = Number((log.changes as changes).to.total);

      // sets the log's date as the key, and overwrites its total to most recent reocrd if there are many records in that date
      groupedByDate[date] = total;
    });

    const eachDayTotal: { date: string; total: number }[] = [];
    const currentDate = new Date();
    let lastTotal = 0;

    // sets the current date back based on the days parameter
    currentDate.setDate(currentDate.getDate() - 365);

    for (let i = 0; i <= 365; i++) {
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

  if (error || data?.error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {data?.error && data?.error?.message} {error && error?.message}
        </div>
      </main>
    );
  if (isLoading)
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
  if (!money) return <main className="w-full h-full"></main>;
  return (
    <Scrollable>
      <div
        style={{
          borderColor: money.color ?? "",
          color: money.color ?? "",
          backgroundColor: money.color ? money.color + 20 : "",
        }}
        className={
          "p-2 border rounded-lg flex flex-row justify-between items-center font-bold ease-in-out transition-all mt-2"
        }
      >
        <p className="truncate">{money.name}</p>
        <div className="font-semibold font-anton flex items-center">
          <TbCurrencyPeso />
          {UsePhpPeso(money.amount ?? 0)}
        </div>
      </div>

      {logs?.length !== 0 ? <>{logs && <LogsTable logs={logs} />}</> : null}
    </Scrollable>
  );
}
