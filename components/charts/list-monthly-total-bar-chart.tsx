import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { gradientOffset, Progress } from "@/lib/hooks";
import { toMonthWord } from "@/lib/utils";
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
import ChartTooltip from "../chart-tooltip";
export default function MonthlyTotalBarChart({
  monthlyTotal,
}: {
  monthlyTotal: Progress[];
}) {
  const off = gradientOffset(monthlyTotal);

  return (
    <Card
      className={"overflow-hidden rounded-lg shadow-none w-full flex flex-col"}
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

            <Tooltip content={ChartTooltip} />
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
