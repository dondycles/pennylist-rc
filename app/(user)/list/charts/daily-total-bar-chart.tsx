import { Badge } from "@/components/ui/badge";
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
  XAxis,
  Tooltip,
} from "recharts";

export default function DailyTotalBarChart({
  dailyTotal,
  open,
  toggleOpen,
  differences,
}: {
  dailyTotal: {
    date: string;
    total: number;
  }[];
  open: boolean;
  toggleOpen: () => void;
  differences: {
    text: {
      yesterday: string;
      week: string;
      twoWeek: string;
      threeWeek: string;
      fourWeek: string;
      threeSixFive: string;
    };
    isUp: {
      yesterday: boolean;
      week: boolean;
      twoWeek: boolean;
      threeWeek: boolean;
      fourWeek: boolean;
      threeSixFive: boolean;
    };
    isZero: {
      yesterday: boolean;
      week: boolean;
      twoWeek: boolean;
      threeWeek: boolean;
      fourWeek: boolean;
      threeSixFive: boolean;
    };
  };
}) {
  const listState = useListState();

  const slicedDailyTotal = dailyTotal.slice(
    dailyTotal.length - listState.dailyTotalDays,
    dailyTotal.length
  );

  const CustomTooltipDailyTotal = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg  p-2  text-sm bg-foreground text-background">
          <p> {payload[0].payload.date}</p>
          <p>{UsePhpPesoWSign(payload[0]?.value)}</p>
          <p>
            <span
              className={
                ((Number(payload[0]?.value) -
                  Number(
                    dailyTotal.find(
                      (day) =>
                        day.date ===
                        new Date(
                          new Date().setDate(
                            new Date(payload[0].payload.date).getDate() - 1
                          )
                        ).toDateString()
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                  100 ===
                0
                  ? "text-muted-foreground"
                  : ((Number(payload[0]?.value) -
                      Number(
                        dailyTotal.find(
                          (day) =>
                            day.date ===
                            new Date(
                              new Date().setDate(
                                new Date(payload[0].payload.date).getDate() - 1
                              )
                            ).toDateString()
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
                    dailyTotal.find(
                      (day) =>
                        day.date ===
                        new Date(
                          new Date().setDate(
                            new Date(payload[0].payload.date).getDate() - 1
                          )
                        ).toDateString()
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                100
              ).toFixed(1)}
              %{" "}
            </span>
            {((Number(payload[0]?.value) -
              Number(
                dailyTotal.find(
                  (day) =>
                    day.date ===
                    new Date(
                      new Date().setDate(
                        new Date(payload[0].payload.date).getDate() - 1
                      )
                    ).toDateString()
                )?.total
              )) /
              Number(payload[0]?.value)) *
              100 ===
            0
              ? "equal"
              : ((Number(payload[0]?.value) -
                  Number(
                    dailyTotal.find(
                      (day) =>
                        day.date ===
                        new Date(
                          new Date().setDate(
                            new Date(payload[0].payload.date).getDate() - 1
                          )
                        ).toDateString()
                    )?.total
                  )) /
                  Number(payload[0]?.value)) *
                  100 >
                0
              ? "up"
              : "down"}{" "}
            than last day
          </p>
        </div>
      );
    }

    // return <div className="bg-black">{JSON.stringify(any)}</div>;

    return null;
  };

  const getDifference = () => {
    const difference =
      (listState.dailyTotalDays === 7 && differences.text.week) ||
      (listState.dailyTotalDays === 14 && differences.text.twoWeek) ||
      (listState.dailyTotalDays === 21 && differences.text.threeWeek) ||
      (listState.dailyTotalDays === 28 && differences.text.fourWeek) ||
      (listState.dailyTotalDays === 365 && differences.text.threeSixFive) ||
      "0";

    const direction =
      (listState.dailyTotalDays === 7 &&
        `${differences.isUp.week ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 14 &&
        `${differences.isUp.twoWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 21 &&
        `${differences.isUp.threeWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 28 &&
        `${differences.isUp.fourWeek ? "up" : "down" || "equal"}`) ||
      (listState.dailyTotalDays === 365 &&
        `${differences.isUp.threeSixFive ? "up" : "down" || "equal"}`) ||
      0;

    return (
      <span
        className={`${
          direction === "equal"
            ? "text-muted-foreground"
            : direction === "up"
            ? "text-green-500"
            : "text-red-400"
        }`}
      >
        {difference} {direction}
      </span>
    );
  };

  return (
    <Collapsible onOpenChange={toggleOpen} open={open}>
      <Card className="overflow-x-hidden rounded-lg shadow-none">
        <CardHeader className="px-2 py-2">
          <div className="flex items-start">
            <CollapsibleTrigger className="w-full">
              <div className="flex  flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-1 py-1">
                  <p>Daily Total</p>
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
                    Last {listState.dailyTotalDays} days
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="p-2 h-fit w-full">
            <Badge className="text-sm block w-fit px-1" variant={"secondary"}>
              {getDifference()} from past {listState.dailyTotalDays} days
            </Badge>
            <ResponsiveContainer width="100%" height={365}>
              <BarChart data={slicedDailyTotal} className="h-12">
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
                  radius={[8, 8, 0, 0]}
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
