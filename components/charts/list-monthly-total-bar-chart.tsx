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
import { ChevronDown } from "lucide-react";
import {
  Bar,
  BarChart,
  Brush,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { motion } from "framer-motion";
export default function MonthlyTotalBarChart({
  monthlyTotal,
  open,
  toggleOpen,
}: {
  monthlyTotal: {
    total: number;
    date: string;
  }[];
  open: boolean;
  toggleOpen: () => void;
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
  // const CustomTooltipMonthlyTotal = (any: any) => {
  //   return (
  //     <div className="rounded-lg  p-2  text-sm backdrop-blur bg-foreground/75 text-background">
  //       {JSON.stringify(any)}
  //     </div>
  //   );

  //   return null;
  // };
  return (
    <motion.div
      initial={false}
      transition={{
        type: "spring",
        duration: 0.5,
        stiffness: 100,
        damping: 12,
      }}
      animate={open ? { height: 296 } : { height: 42 }}
    >
      <Card className={"overflow-hidden rounded-lg shadow-none h-full"}>
        <CardHeader className="px-2 py-2">
          <button
            onClick={toggleOpen}
            className="flex items-start justify-between"
          >
            <div className="flex  flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-1 py-1">
                <p className="font-bold">Monthly Total</p>
                <motion.div
                  transition={{
                    type: "spring",
                    duration: 0.5,
                    stiffness: 100,
                  }}
                  animate={open ? { rotate: 180 } : { rotate: 0 }}
                >
                  <ChevronDown className={"size-4"} />
                </motion.div>
              </CardTitle>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className={` duration-500 ease-in-out transition-all ${
                  open ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
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
          </button>
        </CardHeader>
        <CardContent
          className={`p-2 max-h-[200px] h-screen w-full transition-all duration-500 ease-in-out opacity-100 ${!open && "pointer-events-none opacity-0"}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTotal} className="h-12">
              <XAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dataKey="date"
                tickFormatter={(value: string) =>
                  Number(new Date(value).getMonth()) === new Date().getMonth()
                    ? "This month"
                    : toMonthWord(value)
                }
              />
              {/* <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(value) => UsePhpPesoWSign(value, 0)}
                  axisLine={false}
                /> */}
              <Tooltip content={CustomTooltipMonthlyTotal} />
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
    </motion.div>
  );
}
