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
  Bar,
  BarChart,
  Brush,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function DailyTotalBarChart({
  dailyTotal,
}: {
  dailyTotal: {
    date: string;
    total: number;
  }[];
}) {
  const listState = useListState();
  const CustomTooltipDailyTotal = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg  p-2  text-sm backdrop-blur bg-foreground/75 text-background">
          <p> {payload[0].payload.date}</p>
          <p>{UsePhpPesoWSign(payload[0]?.value)}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-x-hidden rounded-lg shadow-none">
      <CardHeader className="p-2">
        <div className="flex  flex-row justify-between">
          <CardTitle className="pt-2">Daily Total</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                Last {listState.dailyTotalDays} days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 7}
                onClick={() => {
                  listState.setDailyTotalDays(7);
                }}
              >
                7 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 14}
                onClick={() => {
                  listState.setDailyTotalDays(14);
                }}
              >
                14 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 21}
                onClick={() => {
                  listState.setDailyTotalDays(21);
                }}
              >
                21 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 28}
                onClick={() => {
                  listState.setDailyTotalDays(28);
                }}
              >
                28 days
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.dailyTotalDays === 365}
                onClick={() => {
                  listState.setDailyTotalDays(365);
                }}
              >
                365 days
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-2 max-h-[300px] h-screen w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyTotal} className="h-12">
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
                  ? `${toMonthWord(new Date(value).getMonth())} ${new Date(
                      value
                    ).getFullYear()}`
                  : new Date(value).getDate().toString()
              }
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              tickFormatter={(value) => UsePhpPesoWSign(value, 0)}
              axisLine={false}
            />
            <Tooltip content={CustomTooltipDailyTotal} />
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
              {dailyTotal.map((e) => (
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