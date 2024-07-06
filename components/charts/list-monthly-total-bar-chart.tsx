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
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
export default function MonthlyTotalBarChart({
  monthlyTotal,
}: {
  monthlyTotal: {
    total: number;
    date: string;
  }[];
}) {
  const listState = useListState();

  const CustomTooltipMonthlyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = Number(payload[0]?.value);
      const predValue = Number(
        monthlyTotal.find(
          (day) =>
            new Date(day.date).getMonth() ===
            (new Date(payload[0].payload.date).getMonth() - 1 === -1
              ? 11
              : new Date(payload[0].payload.date).getMonth() - 1),
        )?.total,
      );

      const difference = isNaN(((value - predValue) / value) * 100)
        ? 0
        : ((value - predValue) / value) * 100;
      return (
        <div className="rounded-lg  p-2  text-sm bg-foreground text-background">
          <p>
            {toMonthWord(payload[0].payload.date as string)}{" "}
            {new Date(payload[0].payload.date).getFullYear()}
          </p>
          <p>{UsePhpPesoWSign(payload[0]?.value)}</p>

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
            last month
          </p>
        </div>
      );
    }

    return null;
  };

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
          <DropdownMenu>
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
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent
        className={`p-2 flex-1 w-full transition-all duration-500 ease-in-out opacity-100`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart accessibilityLayer data={monthlyTotal}>
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
            <Bar
              animationBegin={0}
              dataKey="total"
              fill="hsl(var(--foreground))"
              radius={4}
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
