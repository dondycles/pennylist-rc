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
export default function DailyTotalBarChart({
  dailyTotal,
  differences,
}: {
  dailyTotal: {
    date: string;
    total: number;
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

  const slicedDailyTotal = dailyTotal.slice(
    dailyTotal.length - listState.dailyTotalDays,
    dailyTotal.length,
  );

  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = Number(payload[0]?.value);
      const predValue = Number(
        dailyTotal.find(
          (day) =>
            day.date ===
            new Date(
              new Date().setDate(
                new Date(payload[0].payload.date).getDate() - 1,
              ),
            ).toDateString(),
        )?.total,
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

    return null;
  };

  const getDifference = () => {
    const difference =
      (listState.dailyTotalDays === 7 && differences.value.week) ||
      (listState.dailyTotalDays === 14 && differences.value.twoWeek) ||
      (listState.dailyTotalDays === 21 && differences.value.threeWeek) ||
      (listState.dailyTotalDays === 28 && differences.value.fourWeek) ||
      (listState.dailyTotalDays === 365 && differences.value.threeSixFive) ||
      "0";

    const direction =
      (listState.dailyTotalDays === 7 &&
        `${differences.isUp.week ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 14 &&
        `${differences.isUp.twoWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 21 &&
        `${differences.isUp.threeWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 28 &&
        `${differences.isUp.fourWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 365 &&
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
              Daily Total
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={` duration-500 ease-in-out transition-all`}
            >
              <Button variant={"outline"}>
                Last {listState.dailyTotalDays} days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 7}
                onClick={(e) => {
                  e.stopPropagation();
                  listState.setDailyTotalDays(7);
                }}
              >
                7 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 14}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyTotalDays(14);
                }}
              >
                14 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 21}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyTotalDays(21);
                }}
              >
                21 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 28}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyTotalDays(28);
                }}
              >
                28 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 365}
                onClick={(e) => {
                  e.stopPropagation();

                  listState.setDailyTotalDays(365);
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
          {getDifference()} from past {listState.dailyTotalDays} days
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
              dataKey="total"
              fill="hsl(var(--muted-foreground))"
              stroke="hsl(var(--primary))"
              radius={4}
              className="bg-red-500"
              type="bump"
            >
              {dailyTotal.map((e) => (
                <Cell
                  key={e.date}
                  style={{
                    fill: "hsl(var(--foreground))",
                  }}
                />
              ))}
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
