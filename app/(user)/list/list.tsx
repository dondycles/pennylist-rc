"use client";
import { getMoneys } from "@/app/actions/moneys";
import { useQuery } from "@tanstack/react-query";
import AddMoneyForm from "./add-money-form";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  XAxis,
  Tooltip,
  Legend,
  Brush,
  YAxis,
} from "recharts";
import {
  AsteriskNumber,
  UsePhpPeso,
  UsePhpPesoWSign,
  toMonthWord,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ListFilter, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Money from "./money";
import { Database } from "@/database.types";
import EditMoneyForm from "./edit-money-form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "@supabase/supabase-js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLogs } from "@/app/actions/logs";

type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};
export default function List({ user }: { user: User }) {
  var _ = require("lodash");
  const listState = useListState();

  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showEditMoneyForm, setEditMoneyForm] = useState<{
    open: boolean;
    money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user"> | null;
  }>({
    open: false,
    money: null,
  });

  const {
    data: moneys,
    error: moneysError,
    isLoading,
    refetch: refetchMoneys,
  } = useQuery({
    queryKey: ["moneys", listState.sort, user.id],
    queryFn: async () => await getMoneys(listState.sort),
  });
  const total = _.sum(moneys?.data?.map((money) => money.amount));

  const {
    data: logs,
    error: logsError,
    isLoading: logsLoading,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["logs", user.id],
    queryFn: async () => await getLogs(),
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text
          x={cx}
          y={cy}
          dy={-18}
          textAnchor="middle"
          fill={fill}
          style={{ fontWeight: "bold" }}
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={0}
          textAnchor="middle"
          fill={fill}
          style={{ fontSize: "0.8rem" }}
        >
          {UsePhpPesoWSign(value)}
        </text>
        <text
          x={cx}
          y={cy}
          dy={16}
          textAnchor="middle"
          fill={fill}
          style={{ fontSize: "0.8rem" }}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill}
          strokeWidth={2}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 8}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  const getDailyTotal = (
    days: number = listState.dailyTotalDays
  ): { date: string; total: number }[] => {
    const groupedByDate: {
      [key: string]: {
        total: number;
        date: string;
      };
    } = {};

    // Group by date and keep the most recent total for each day
    logs?.data?.reverse().forEach((entry) => {
      const date = new Date(entry.created_at).toDateString();
      const total = Number((entry.changes as changes).to.total);
      groupedByDate[date] = { total: total, date: entry.created_at }; // This will overwrite with the most recent total
    });

    const eachDayTotal: { date: string; total: number }[] = [];
    const currentDate = new Date();
    let lastTotal = 0;

    currentDate.setDate(currentDate.getDate() - days);
    for (let i = 0; i <= days; i++) {
      const day = currentDate.toDateString();

      if (groupedByDate[day] !== undefined) {
        lastTotal = groupedByDate[day].total;
      }

      eachDayTotal.push({ date: day, total: lastTotal });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return eachDayTotal;
  };
  const CustomTooltip = ({ active, payload, label }: any) => {
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

  if (moneys?.error || moneysError || logsError || logs?.error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {moneys?.error && moneys.error.message}
          {moneysError && moneysError.message}
          {logs?.error && logs.error}
          {logsError && logsError.message}
        </div>
      </main>
    );
  if (isLoading || logsLoading)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-muted-foreground gap-2 justify-center">
          Loading... <Loader2 className="animate-spin" />
        </div>
      </main>
    );

  return (
    <main className="w-full h-full px-2">
      <ScrollArea className="max-w-[800px] mx-auto h-full">
        {/* total money and add money form */}
        <div className="flex flex-col">
          <div className="mt-2 border rounded-lg p-4 shadow-lg flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col min-w-0">
              <div className="text-muted-foreground text-xs flex items-center gap-1 w-fit">
                Total Money{" "}
                <button onClick={() => listState.toggleHideAmounts()}>
                  {!listState.hideAmounts ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <div className="text-2xl sm:text-4xl font-anton flex flex-row items-center truncate">
                <TbCurrencyPeso className="shrink-0" />
                <p className="truncate">
                  {listState.hideAmounts
                    ? AsteriskNumber(total)
                    : UsePhpPeso(total)}
                </p>
              </div>
            </div>
            <Drawer open={showAddMoneyForm} onOpenChange={setShowAddMoneyForm}>
              <DrawerTrigger asChild>
                <Button size={"icon"} className="rounded-full shrink-0">
                  <Plus />
                </Button>
              </DrawerTrigger>
              <DrawerContent className=" p-2 gap-2">
                <p className="font-bold text-sm text-center">Add money</p>
                <AddMoneyForm
                  currentTotal={total}
                  close={() => {
                    setShowAddMoneyForm(false);
                    refetchMoneys();
                    refetchLogs();
                  }}
                />
              </DrawerContent>
            </Drawer>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="text-xs text-muted-foreground mt-8 ml-auto mr-0 flex items-center gap-1">
              <p>sort</p> <ListFilter size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={listState.sort.by === "amount"}
                onClick={() => {
                  listState.setSort(listState.sort.asc, "amount");
                }}
              >
                Amount
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={listState.sort.by === "created_at"}
                onClick={() => {
                  listState.setSort(listState.sort.asc, "created_at");
                }}
              >
                Date created
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={listState.sort.asc}
                onClick={() => {
                  listState.setSort(true, listState.sort.by);
                }}
              >
                Ascending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={!listState.sort.asc}
                onClick={() => {
                  listState.setSort(false, listState.sort.by);
                }}
              >
                Descending
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* edit money form */}
        <Drawer
          open={showEditMoneyForm.open}
          onOpenChange={(e) => {
            setEditMoneyForm((prev) => ({
              ...prev,
              open: e,
            }));
          }}
        >
          <DrawerContent className=" p-2 gap-2">
            <p className="font-bold text-sm text-center">Edit money</p>
            <EditMoneyForm
              currentTotal={total}
              money={showEditMoneyForm.money!}
              close={() => {
                setEditMoneyForm((prev) => ({
                  ...prev,
                  open: false,
                }));
                refetchMoneys();
                refetchLogs();
              }}
            />
          </DrawerContent>
        </Drawer>
        {/* moneys list */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {moneys?.data?.map((money) => {
            return (
              <Money
                edit={() => setEditMoneyForm({ money: money, open: true })}
                done={() => {
                  refetchLogs();
                  refetchMoneys();
                }}
                money={money}
                key={money.id}
                hideAmounts={listState.hideAmounts}
                currentTotal={total}
              />
            );
          })}
        </div>
        {/* charts */}
        {moneys?.data?.length ? (
          <Card className="w-full mt-2  rounded-lg shadow-none">
            <CardHeader className="px-2 py-4">
              <CardTitle>Total Breakdown </CardTitle>
            </CardHeader>
            <CardContent className="aspect-square p-2 max-h-[60vh] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={moneys.data}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    fill="hsl(var(--foreground))"
                    dataKey="amount"
                    onMouseEnter={(_, i) => {
                      setActiveIndex(i);
                    }}
                  >
                    {moneys?.data?.map((entry, index) => (
                      <Cell
                        className="fill-background stroke-foreground stroke-2"
                        key={`cell-${index}`}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : null}

        {/* tables */}
        <Card className="mt-2 overflow-x-hidden rounded-lg shadow-none">
          <CardHeader className="py-4 px-2">
            <CardTitle>Logs</CardTitle>
          </CardHeader>
          <CardContent className="w-full p-0 overflow-auto">
            <ScrollArea className="h-[512px]  w-full">
              <Table className="w-full h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-fit">Action</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs?.data?.map((log) => {
                    return (
                      <TableRow key={log.id}>
                        <TableCell
                          className={`${log.type === "add" && "text-green-500"}
                          ${log.type === "update" && "text-yellow-500"}
                          ${log.type === "delete" && "text-red-500"}
                          `}
                        >
                          {log.type}
                        </TableCell>
                        <TableCell>
                          {log.type === "add" ? (
                            <>
                              {(log.changes as changes).to.name} -{" "}
                              {UsePhpPesoWSign(
                                (log.changes as changes).to.amount
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col gap-2  w-fit">
                              {(log.changes as changes).from.name !==
                                (log.changes as changes).to.name && (
                                <div className="flex flex-row ">
                                  <p className="flex-1">
                                    {(log.changes as changes).from.name} to{" "}
                                    {(log.changes as changes).to.name}
                                  </p>
                                </div>
                              )}
                              {(log.changes as changes).from.amount !==
                                (log.changes as changes).to.amount && (
                                <div className="flex flex-row  ">
                                  <p className="flex-1 w-fit ">
                                    {UsePhpPesoWSign(
                                      (log.changes as changes).from.amount
                                    )}{" "}
                                    to{" "}
                                    {UsePhpPesoWSign(
                                      (log.changes as changes).to.amount
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {UsePhpPesoWSign((log.changes as changes).to.total)}
                        </TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {/* <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter> */}
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="mt-2 mb-24 overflow-x-hidden rounded-lg shadow-none">
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
              <BarChart data={getDailyTotal()} className="h-12">
                <XAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toISOString().split("T")[0] ===
                    new Date().toISOString().split("T")[0]
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
                <Tooltip contentStyle={{}} content={CustomTooltip} />
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
                  {getDailyTotal().map((e) => (
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
      </ScrollArea>
    </main>
  );
}
