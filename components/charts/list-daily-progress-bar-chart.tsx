import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { gradientOffset } from "@/lib/hooks";
import { toMonthWord } from "@/lib/utils";
import { useListState } from "@/store";

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
import ChartTooltip from "../chart-tooltip";
import { CalendarDays } from "lucide-react";
import { type Progress } from "@/lib/types";

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

  const off = gradientOffset(dailyProgress);

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
      className={"overflow-hidden rounded-lg shadow-none w-full flex flex-col"}
    >
      <CardHeader className="p-2 border-b mb-2">
        <div className="flex items-start justify-between">
          <div className="flex  flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-1 py-1 text-muted-foreground font-normal text-sm">
              <CalendarDays size={20} />
              Daily Progress
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`flex-1 w-full aspect-square flex flex-col gap-2 px-2 pb-2`}
      >
        <div className="flex gap-2 justify-between">
          <Badge
            className="text-xs w-fit  justify-center gap-1  text-muted-foreground"
            variant={"secondary"}
          >
            {getDifference()} from past {listState.dailyProgressDays} days
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={` duration-500 ease-in-out transition-all`}
            >
              <Button
                className="font-normal text-muted-foreground"
                variant={"outline"}
              >
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
            <Tooltip content={ChartTooltip} />
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
                <stop offset={0} stopColor="#44ff44" stopOpacity={1} />
                <stop
                  offset={off}
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.5}
                />
                <stop
                  offset={off}
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.5}
                />
                <stop offset={1} stopColor="#ff4444" stopOpacity={1} />
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
              dataKey="expensesSum"
              type="monotone"
              stroke="#884444"
              strokeWidth={2}
            />
            <Line
              fillOpacity={1}
              dataKey="gainsSum"
              type="monotone"
              stroke="#448844"
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
