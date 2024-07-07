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
  Line,
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
      const data = payload[0].payload;
      const total = Number(payload[0]?.value);
      const gainOrLoss = data.gainOrLoss;
      const gainSum = data.gainsSum;
      const expensesSum = data.expensesSum;
      return (
        <div className="rounded-lg p-2 text-sm bg-muted flex flex-col gap-2  border shadow-lg">
          <p className="text-muted-foreground">
            {toMonthWord(data.date)} {new Date(data.date).getFullYear()}
          </p>
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
        "overflow-hidden rounded-lg shadow-none w-full aspect-[3/5] flex flex-col"
      }
    >
      <CardHeader className="px-2 py-2">
        <div className="flex flex-row items-start justify-between">
          <div className="flex  flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-1 py-1 font-bold">
              Monthly Total
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`flex-1 w-full aspect-square flex flex-col px-2 pb-2`}
      >
        <ResponsiveContainer className={"flex-1"} width="100%" height="100%">
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
