import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
                ((Number(payload[0]?.value) -
                  Number(
                    monthlyTotal.find(
                      (day) =>
                        new Date(day.date).getMonth() ===
                        (new Date(payload[0].payload.date).getMonth() - 1 === -1
                          ? 11
                          : new Date(payload[0].payload.date).getMonth() - 1)
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                  100 ===
                0
                  ? "text-muted-foreground"
                  : ((Number(payload[0]?.value) -
                      Number(
                        monthlyTotal.find(
                          (day) =>
                            new Date(day.date).getMonth() ===
                            (new Date(payload[0].payload.date).getMonth() -
                              1 ===
                            -1
                              ? 11
                              : new Date(payload[0].payload.date).getMonth() -
                                1)
                        )?.total
                      )) /
                      Number(payload[0]?.value)) *
                      100 >
                    0
                  ? "text-green-500"
                  : "text-red-400"
              }
            >
              {(
                ((Number(payload[0]?.value) -
                  Number(
                    monthlyTotal.find(
                      (day) =>
                        new Date(day.date).getMonth() ===
                        (new Date(payload[0].payload.date).getMonth() - 1 === -1
                          ? 11
                          : new Date(payload[0].payload.date).getMonth() - 1)
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                100
              ).toFixed(1)}
              %{" "}
            </span>
            {((Number(payload[0]?.value) -
              Number(
                monthlyTotal.find(
                  (day) =>
                    new Date(day.date).getMonth() ===
                    (new Date(payload[0].payload.date).getMonth() - 1 === -1
                      ? 11
                      : new Date(payload[0].payload.date).getMonth() - 1)
                )?.total
              )) /
              Number(payload[0]?.value)) *
              100 ===
            0
              ? "equal"
              : ((Number(payload[0]?.value) -
                  Number(
                    monthlyTotal.find(
                      (day) =>
                        new Date(day.date).getMonth() ===
                        (new Date(payload[0].payload.date).getMonth() - 1 === -1
                          ? 11
                          : new Date(payload[0].payload.date).getMonth() - 1)
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                  100 >
                0
              ? "up"
              : "down"}{" "}
            than last month
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
    <Collapsible onOpenChange={toggleOpen} open={open}>
      <Card className="overflow-x-hidden rounded-lg shadow-none">
        <CardHeader className="px-2 py-2">
          <div className="flex items-start">
            <CollapsibleTrigger className="w-full">
              <div className="flex  flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-1 py-1">
                  <p>Monthly Total</p>
                  <ChevronDown
                    className={`size-4 ${open && "rotate-180"} transition-all`}
                  />
                </CardTitle>
              </div>
            </CollapsibleTrigger>
            {open && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"}>
                    by {listState.monthlyTotalBy} record
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuCheckboxItem
                    checked={listState.monthlyTotalBy === "last"}
                    onClick={() => {
                      listState.setMonthlyTotalBy("last");
                    }}
                  >
                    last record
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={listState.monthlyTotalBy === "avg"}
                    onClick={() => {
                      listState.setMonthlyTotalBy("avg");
                    }}
                  >
                    average
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-2 max-h-[200px] h-screen w-full">
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
