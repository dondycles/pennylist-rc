import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/lib/hooks";
import { UsePhpPesoWSign, toMonthWord } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
export default function MonthlyTotalBarChart({
  monthlyTotal,
}: {
  monthlyTotal: Progress[];
}) {
  const CustomTooltipMonthlyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const currentTotal = Number(payload[0]?.value);
      const previousTotal = Number(
        monthlyTotal.find(
          (day) =>
            new Date(day.date).getMonth() ===
            (new Date(payload[0].payload.date).getMonth() - 1 === -1
              ? 11
              : new Date(payload[0].payload.date).getMonth() - 1),
        )?.currentTotal,
      );
      const difference = isNaN(
        ((currentTotal - previousTotal) / currentTotal) * 100,
      )
        ? 0
        : ((currentTotal - previousTotal) / currentTotal) * 100;
      const gainOrLoss = payload[0].payload.gainOrLoss;
      return (
        <div className="rounded-lg p-2 text-sm bg-foreground text-background max-w-[200px] flex flex-col gap-2">
          <p className="text-muted-foreground">
            {toMonthWord(payload[0].payload.date as string)}{" "}
            {new Date(payload[0].payload.date).getFullYear()}
          </p>
          <p className="font-anton font-black">{UsePhpPesoWSign(gainOrLoss)}</p>
          <div className="flex flex-row gap-1">
            <div className="size-4 rounded bg-gradient-to-b from-muted-foreground to-muted-foreground/25 shrink-0" />
            <p>
              Total:{" "}
              <span className="font-black font-anton">
                {UsePhpPesoWSign(payload[0]?.value)}
              </span>{" "}
              (
              <span
                className={`font-black font-anton ${
                  difference === 0
                    ? "text-muted-foreground"
                    : difference > 0
                      ? "text-green-500"
                      : "text-red-400"
                }`}
              >
                {difference.toFixed(1)}%{" "}
              </span>
              {difference === 0 ? "equal" : difference > 0 ? "up" : "down"} than
              last month)
            </p>
          </div>
          <div hidden={gainOrLoss === 0} className={`flex flex-row gap-1`}>
            <div
              className={`size-4 rounded shrink-0 ${gainOrLoss > 0 ? "from-green-500 to-muted-foreground/25 bg-gradient-to-b" : "from-red-400 to-muted-foreground/25 bg-gradient-to-t"}`}
            />
            <p className="flex flex-row gap-1 items-center">
              {gainOrLoss > 0 ? (
                <>
                  <ArrowUp size={12} />
                  Gained
                </>
              ) : (
                <>
                  <ArrowDown size={12} />
                  Lost
                </>
              )}{" "}
              <span className="font-anton font-black">
                {UsePhpPesoWSign(gainOrLoss)}
              </span>
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(
      ...monthlyTotal
        .filter((i) => i.gainOrLoss !== 0)
        .map((i) => i.gainOrLoss),
    );
    const dataMin = Math.min(
      ...monthlyTotal
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

  return (
    <Card
      className={
        "overflow-hidden rounded-lg shadow-none w-full aspect-square flex flex-col"
      }
    >
      <CardHeader className="px-2 py-2">
        <div className="flex flex-row items-start justify-between">
          <div className="flex  flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-1 py-1 font-bold">
              Monthly Total
            </CardTitle>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className={` duration-500 ease-in-out transition-all `}
            >
              <Button variant={"outline"}>
                by {listState.monthlyTotalBy} record
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={listState.monthlyTotalBy === "last"}
                onClick={(e) => {
                  e.stopPropagation();
                  listState.setMonthlyTotalBy("last");
                }}
              >
                last record
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.monthlyTotalBy === "avg"}
                onClick={(e) => {
                  e.stopPropagation();
                  listState.setMonthlyTotalBy("avg");
                }}
              >
                average
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent
        className={`p-2 flex-1 w-full transition-all duration-500 ease-in-out opacity-100`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyTotal}>
            <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
            <XAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              dataKey="date"
              tickFormatter={(value: string) =>
                Number(new Date(value).getMonth()) === new Date().getMonth()
                  ? "This month"
                  : toMonthWord(value)
              }
            />

            <Tooltip content={CustomTooltipMonthlyTotal} />
            <defs>
              <linearGradient
                id="monthlyTotalColor"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              fill="url(#monthlyTotalColor)"
              radius={4}
              className="bg-red-500"
            >
              {monthlyTotal?.map((e) => <Cell key={e.date} />)}
            </Bar>
            <defs>
              <linearGradient
                id="monthlySplitColor"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset={0} stopColor="#448844" stopOpacity={1} />
                <stop offset={off} stopColor="#448844" stopOpacity={0.5} />
                <stop offset={off} stopColor="#884444" stopOpacity={0.5} />
                <stop offset={1} stopColor="#884444" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Area
              stackId="c"
              dataKey="gainOrLoss"
              fill="url(#monthlySplitColor)"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={0.5}
              fillOpacity={1}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
