import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gradientOffset } from "@/lib/hooks";
import { toMonthWord } from "@/lib/utils";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import ChartTooltip from "../chart-tooltip";
import { CalendarDays } from "lucide-react";
import { type Progress } from "@/lib/types";
export default function ProgressBarChart({
  progress,
}: {
  progress: Progress[];
}) {
  const off = gradientOffset(progress);

  return (
    <Card className="overflow-hidden rounded-lg shadow-none w-full flex flex-col">
      <CardHeader className="p-2 border-b mb-2">
        <CardTitle className="flex items-center gap-1 py-1 text-muted-foreground font-normal text-sm">
          <CalendarDays size={20} />
          Progress (Last 28 days)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 w-full aspect-square flex flex-col px-2 pb-2">
        <ResponsiveContainer className={"flex-1"} width="100%" height="100%">
          <ComposedChart accessibilityLayer data={progress}>
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

            <Tooltip offset={51} cursor={true} content={ChartTooltip} />
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
