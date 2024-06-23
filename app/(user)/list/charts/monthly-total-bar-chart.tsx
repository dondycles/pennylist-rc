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
  YAxis,
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
