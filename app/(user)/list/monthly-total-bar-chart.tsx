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
  YAxis,
} from "recharts";

export default function MonthlyTotalBarChart({
  monthlyTotal,
}: {
  monthlyTotal: {
    total: number;
    date: string;
  }[];
}) {
  const CustomTooltipMonthlyTotal = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg  p-2  text-sm backdrop-blur bg-foreground/75 text-background">
          <p>
            {toMonthWord(
              Number((payload[0].payload.date as string).split("-")[0])
            )}{" "}
            {(payload[0].payload.date as string).split("-")[1]}
          </p>
          <p>{UsePhpPesoWSign(payload[0]?.value)}</p>
        </div>
      );
    }

    return null;
  };
  return (
    <Card className="overflow-x-hidden rounded-lg shadow-none">
      <CardHeader className="p-2">
        <CardTitle className="pt-2">Monthly Total</CardTitle>
      </CardHeader>
      <CardContent className="p-2 max-h-[300px] h-screen w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyTotal} className="h-12">
            <XAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dataKey="date"
              tickFormatter={(value: string) =>
                Number(value.split("-")[0]) === new Date().getMonth()
                  ? "This month"
                  : toMonthWord(Number(value.split("-")[0]))
              }
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              tickFormatter={(value) => UsePhpPesoWSign(value, 0)}
              axisLine={false}
            />
            <Tooltip content={CustomTooltipMonthlyTotal} />
            <Brush
              dataKey="total"
              height={30}
              stroke="hsl(var(--muted-foreground))"
            />
            <Bar
              dataKey="total"
              fill="hsl(var(--foreground))"
              radius={[4, 4, 0, 0]}
              className="bg-red-500"
            >
              {monthlyTotal?.map((e) => (
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
