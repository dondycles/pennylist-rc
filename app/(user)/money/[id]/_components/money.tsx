"use client";
import { getMoney, setColor } from "@/app/actions/moneys";
import Scrollable from "@/components/scrollable";
import { Skeleton } from "@/components/ui/skeleton";
import { UsePhpPeso } from "@/lib/utils";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { TbCurrencyPeso } from "react-icons/tb";
import LogsTable from "./logs-table";
import { Button } from "@/components/ui/button";
import { Palette, Pencil, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { colors } from "@/constants/colors";
import { useState } from "react";

export default function Money({
  list,
  moneyId,
}: {
  list: User;
  moneyId: string;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["money", moneyId, list.id],
    queryFn: async () => await getMoney(moneyId),
  });
  const money = data?.data;
  const logs = data?.data?.logs;

  const lastUpdate = money?.logs
    .toReversed()
    .findLast((log) => log)?.created_at;

  const handleSetColor = async (color: string) => {
    setOpen(false);
    if (!money) return;
    const { error } = await setColor(money, color);
    if (error) console.log(error);
    refetch();
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
          "p-4 shadow-lg border rounded-lg flex flex-row justify-between items-center font-bold ease-in-out transition-all mt-2"
        }
      >
        <div className="flex flex-col min-w-0">
          <p className="text-xs flex items-center gap-1 w-fit">{money.name}</p>
          <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate -ml-1 sm:-ml-2">
            <TbCurrencyPeso className="shrink-0" />
            <p className="truncate">{UsePhpPeso(money.amount ?? 0)}</p>
          </div>
        </div>

        <div className="flex gap-4 w-fit shrink-0">
          <button>
            <Trash size={20} />
          </button>
          <button>
            <Pencil size={20} />
          </button>
          <Popover onOpenChange={setOpen} open={open}>
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
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground">
          Created at: {new Date(money.created_at).toLocaleString()}
        </p>
        {lastUpdate && (
          <p className="text-xs text-muted-foreground">
            Last update at: {new Date(lastUpdate).toLocaleString()}
          </p>
        )}
      </div>

      {logs?.length !== 0 ? <>{logs && <LogsTable logs={logs} />}</> : null}
    </Scrollable>
  );
}
