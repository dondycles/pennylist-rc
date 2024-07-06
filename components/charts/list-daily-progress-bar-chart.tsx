import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UsePhpPesoWSign, toMonthWord } from "@/lib/utils";
import { useListState } from "@/store";
import {
  Cell,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
export default function DailyProgressBarChart({
  dailyProgress,
  differences,
}: {
  dailyProgress: {
    expenses: {
      amount: number;
      reason: string;
    }[];
    gains: {
      amount: number;
      reason: string;
    }[];
    date: string;
    expensesSum: number;
    gainsSum: number;
    gainOrLoss: number;
    currentTotal: number;
  }[];
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

  const slicedDailyTotal = dailyProgress.slice(
    dailyProgress.length - listState.dailyProgressDays,
    dailyProgress.length,
  );

  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = Number(payload[0]?.value);
      const predTotal = Number(
        dailyProgress.find(
          (day) =>
            day.date ===
            new Date(
              new Date().setDate(
                new Date(payload[0].payload.date).getDate() - 1,
              ),
            ).toDateString(),
        )?.currentTotal,
      );
      const difference = isNaN(((total - predTotal) / total) * 100)
        ? 0
        : ((total - predTotal) / total) * 100;
      const gainOrLoss = payload[0].payload.gainOrLoss;
      return (
        <div className="rounded-lg  p-2  text-sm bg-foreground text-background">
          <p className="text-muted-foreground">{payload[0].payload.date}</p>
          <p>Total: {UsePhpPesoWSign(total)}</p>
          <p className="text-muted-foreground">
            Total is{" "}
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
            previous day
          </p>
          <p
            hidden={gainOrLoss === 0}
            className={gainOrLoss > 0 ? "text-green-500" : "text-red-400"}
          >
            {gainOrLoss > 0 ? "Gained " : "Lost "} {UsePhpPesoWSign(gainOrLoss)}
          </p>
        </div>
      );
    }

    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...dailyProgress.map((i) => i.gainOrLoss));
    const dataMin = Math.min(...dailyProgress.map((i) => i.gainOrLoss));

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
        "overflow-hidden rounded-lg shadow-none w-full aspect-square flex flex-col"
      }
    >
      <CardHeader className="px-2 py-2">
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
        className={`p-2 flex-1 w-full aspect-square  transition-all duration-500 ease-in-out opacity-100 flex flex-col`}
      >
        <Badge className="text-sm block w-fit px-1" variant={"secondary"}>
          {getDifference()} from past {listState.dailyProgressDays} days
        </Badge>
        <ResponsiveContainer className={"flex-1"} width="100%" height="100%">
          <AreaChart accessibilityLayer data={slicedDailyTotal}>
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
            <Tooltip content={CustomTooltipDailyTotal} />
            <Area
              animationBegin={0}
              dataKey="currentTotal"
              fill="hsl(var(--muted-foreground))"
              stroke="hsl(var(--primary))"
              radius={4}
              className="bg-red-500"
              type="step"
            >
              {dailyProgress.map((e) => (
                <Cell
                  key={e.date}
                  style={{
                    fill: "hsl(var(--foreground))",
                  }}
                />
              ))}
            </Area>
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="#448844" stopOpacity={1} />
                <stop offset={off} stopColor="#884444" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area
              stackId="c"
              dataKey="gainOrLoss"
              fill="url(#splitColor)"
              stroke="hsl(var(--primary))"
              radius={4}
              fillOpacity={1}
              type="step"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
