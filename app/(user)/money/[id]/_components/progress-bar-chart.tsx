import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UsePhpPesoWSign, toMonthWord } from "@/lib/utils";
import {
  Bar,
  BarChart,
  Brush,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
export default function ProgressBarChart({
  progress,
}: {
  progress: { date: string; total: number }[];
}) {
  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = Number(isNaN(payload[0]?.value) ? 0 : payload[0]?.value);
      const predValue = Number(
        progress.find(
          (day) =>
            day.date ===
            new Date(
              new Date().setDate(
                new Date(payload[0].payload.date).getDate() - 1
              )
            ).toDateString()
        )?.total
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

    // return <div className="bg-black">{JSON.stringify(any)}</div>;

    return null;
  };

  return (
    <Card className="shadow-none rounded-lg">
      <CardHeader className="px-2 py-3">
        <CardTitle className="font-bold">Progress (Last 28 days)</CardTitle>
      </CardHeader>
      <CardContent className="p-2 h-fit w-full">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={progress} className="h-12">
            <XAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toDateString() === new Date().toDateString()
                  ? "Today"
                  : new Date(value).getDate() === 1
                  ? `${toMonthWord(value)} ${new Date(value).getFullYear()}`
                  : new Date(value).getDate().toString()
              }
            />
            {/* <YAxis
        stroke="hsl(var(--muted-foreground))"
        fontSize={10}
        tickLine={false}
        tickFormatter={(value) => UsePhpPesoWSign(value, 0)}
        axisLine={false}
      /> */}
            <Tooltip content={CustomTooltipDailyTotal} />
            <Brush
              dataKey="total"
              height={30}
              stroke="hsl(var(--muted-foreground))"
            />
            <Bar
              animationBegin={0}
              dataKey="total"
              fill="hsl(var(--foreground))"
              radius={[4, 4, 0, 0]}
              className="bg-red-500"
            >
              {progress.map((e) => (
                <Cell
                  key={e.date}
                  style={{
                    fill: "hsl(var(--foreground))",
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
