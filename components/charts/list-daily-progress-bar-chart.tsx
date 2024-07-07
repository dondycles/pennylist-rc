import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/lib/hooks";
import { UsePhpPesoWSign, toMonthWord } from "@/lib/utils";
import { useListState } from "@/store";
import { MousePointerClick } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
  Bar,
  Line,
} from "recharts";

import { Table, TableBody, TableCell, TableRow } from "../ui/table";
export default function DailyProgressBarChart({
  dailyProgress,
  differences,
}: {
  dailyProgress: Progress[];
  differences: {
    value: {
      yesterday: string;
      week: string;
      twoWeek: string;
      threeWeek: string;
      fourWeek: string;
      threeSixFive: string;
    };
    isUp: {
      yesterday: boolean;
      week: boolean;
      twoWeek: boolean;
      threeWeek: boolean;
      fourWeek: boolean;
      threeSixFive: boolean;
    };
    isZero: {
      yesterday: boolean;
      week: boolean;
      twoWeek: boolean;
      threeWeek: boolean;
      fourWeek: boolean;
      threeSixFive: boolean;
    };
  };
}) {
  const listState = useListState();

  const slicedDailyProgress = dailyProgress.slice(
    dailyProgress.length - listState.dailyProgressDays,
    dailyProgress.length,
  );

  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = Number(payload[0]?.value);
      const gainOrLoss = data.gainOrLoss;
      const gainSum = data.gainsSum;
      const expensesSum = data.expensesSum;
      return (
        <div className="rounded-lg p-2 text-sm bg-muted flex flex-col gap-2  border shadow-lg">
          <p className="text-muted-foreground">{data.date}</p>
          <div className="text-xs flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-1">
                <div className="bg-green-500/50 w-3 h-1" /> Gain
              </div>
              <div className="font-anton font-black">
                {UsePhpPesoWSign(gainSum)}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-1">
                <div className="bg-red-500/50 w-3 h-1" />
                Loss
              </div>
              <div className="font-anton font-black">
                {UsePhpPesoWSign(expensesSum)}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-1">
                <div className="bg-gradient-to-b from-green-500 to-red-400 size-3 rounded" />
                Difference
              </div>
              <div className="font-anton font-black">
                {UsePhpPesoWSign(gainOrLoss)}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex items-center gap-1">
                <div className="bg-gradient-to-b from-primary to-transparent size-3 rounded" />
                Current Total
              </div>
              <div className="font-anton font-black">
                {UsePhpPesoWSign(total)}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(
      ...slicedDailyProgress
        .filter((i) => i.gainOrLoss !== 0)
        .map((i) => i.gainOrLoss),
    );
    const dataMin = Math.min(
      ...slicedDailyProgress
        .filter((i) => i.gainOrLoss !== 0)
        .map((i) => i.gainOrLoss),
    );

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const getDifference = () => {
    const difference =
      (listState.dailyProgressDays === 7 && differences.value.week) ||
      (listState.dailyProgressDays === 14 && differences.value.twoWeek) ||
      (listState.dailyProgressDays === 21 && differences.value.threeWeek) ||
      (listState.dailyProgressDays === 28 && differences.value.fourWeek) ||
      (listState.dailyProgressDays === 365 && differences.value.threeSixFive) ||
      "0";

    const direction =
      (listState.dailyProgressDays === 7 &&
        `${differences.isUp.week ? "up" : "down" || "equal"}`) ||
      (listState.dailyProgressDays === 14 &&
        `${differences.isUp.twoWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyProgressDays === 21 &&
        `${differences.isUp.threeWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyProgressDays === 28 &&
        `${differences.isUp.fourWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyProgressDays === 365 &&
        `${differences.isUp.threeSixFive ? "up" : "down" || "equal"}`) ||
      0;

    return (
      <span
        className={`${
          direction === "equal"
            ? "text-muted-foreground"
            : direction === "up"
              ? "text-green-500"
              : "text-red-400"
        }`}
      >
        {difference} {direction}
      </span>
    );
  };

  return (
    <Card
      className={
        "overflow-hidden rounded-lg shadow-none w-full aspect-[3/5] flex flex-col"
      }
    >
      <CardHeader className="p-2 m-0">
        <div className="flex items-start justify-between">
          <div className="flex  flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-1 py-1 font-bold">
              Daily Progress
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={` duration-500 ease-in-out transition-all`}
            >
              <Button variant={"outline"}>
                Last {listState.dailyProgressDays} days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={listState.dailyProgressDays === 7}
                onClick={(e) => {
                  e.stopPropagation();
                  listState.setDailyProgressDays(7);
                }}
              >
                7 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyProgressDays === 14}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyProgressDays(14);
                }}
              >
                14 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyProgressDays === 21}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyProgressDays(21);
                }}
              >
                21 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyProgressDays === 28}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyProgressDays(28);
                }}
              >
                28 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyProgressDays === 365}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyProgressDays(365);
                }}
              >
                365 days
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent
        className={`flex-1 w-full aspect-square flex flex-col px-2 pb-2`}
      >
        <Badge className="text-sm block w-fit px-1" variant={"secondary"}>
          {getDifference()} from past {listState.dailyProgressDays} days
        </Badge>
        <ResponsiveContainer className={"flex-1"} width="100%" height="100%">
          <ComposedChart accessibilityLayer data={slicedDailyProgress}>
            <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
            <XAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toDateString() === new Date().toDateString()
                  ? "Today"
                  : new Date(value).getDate() === 1
                    ? `${toMonthWord(value)} ${new Date(value).getFullYear()}`
                    : new Date(value).getDate().toString()
              }
            />

            <Tooltip
              position={{ y: 50 }}
              offset={51}
              cursor={true}
              content={CustomTooltipDailyTotal}
            />
            <defs>
              <linearGradient id="dailyTotalColor" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset={"5%"}
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.8}
                />
                <stop
                  offset={"95%"}
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Bar
              animationBegin={0}
              dataKey="currentTotal"
              fill="url(#dailyTotalColor)"
              strokeWidth={0.5}
              radius={4}
              type="step"
            />

            <defs>
              <linearGradient id="dailySplitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={0} stopColor="#448844" stopOpacity={1} />
                <stop offset={off} stopColor="#448844" stopOpacity={0.5} />
                <stop offset={off} stopColor="#884444" stopOpacity={0.5} />
                <stop offset={1} stopColor="#884444" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="gainOrLoss"
              fill="url(#dailySplitColor)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
              fillOpacity={1}
              type="monotone"
            />
            <Line
              fillOpacity={1}
              dataKey="gainsSum"
              type="monotone"
              stroke="#448844"
              strokeWidth={2}
            />
            <Line
              fillOpacity={1}
              dataKey="expensesSum"
              type="monotone"
              stroke="#884444"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="p-2 m-0 text-xs flex flex-wrap gap-2 justify-center shrink-0">
          <div className="space-y-2">
            <div className="flex flex-row gap-1">
              <div className="size-4 rounded from-transparent to-primary bg-gradient-to-t" />
              <p className="text-muted-foreground">Total</p>
            </div>
            <div className="flex flex-row gap-1">
              <div className="size-4 rounded from-green-500/50 to-red-500/50  bg-gradient-to-b" />
              <p className="text-muted-foreground">Difference</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-row gap-1 items-center">
              <div className="w-4 h-[2px] bg-green-500/50" />
              <p className="text-muted-foreground">Gain</p>
            </div>
            <div className="flex flex-row gap-1 items-center">
              <div className="w-4 h-[2px] bg-red-400/50" />
              <p className="text-muted-foreground">Loss</p>
            </div>
          </div>
          <p className="text-muted-foreground text-center">
            *Difference is equal to gain minus loss and also equal to the
            difference of current total from previous total.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
