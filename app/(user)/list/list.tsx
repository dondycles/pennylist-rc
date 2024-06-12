"use client";
import { getMoneys } from "@/app/actions/moneys";
import { useQuery } from "@tanstack/react-query";
import AddMoneyForm from "./add-money-form";
import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

import { AsteriskNumber, UsePhpPeso, UsePhpPesoWSign } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ListFilter, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Money from "./money";
import { Database } from "@/database.types";
import EditMoneyForm from "./edit-money-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useListState } from "@/store";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function List() {
  var _ = require("lodash");
  const listState = useListState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [showEditMoneyForm, setEditMoneyForm] = useState<{
    open: boolean;
    money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user"> | null;
  }>({
    open: false,
    money: null,
  });
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["moneys", listState.sort],
    queryFn: async () => await getMoneys(listState.sort),
  });
  const moneys = data?.data?.map((money) => money);
  const total = _.sum(moneys?.map((money) => money.amount));

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

  if (data?.error || error)
    return (
      <main className="w-full h-full p-2 ">
        <div className="flex items-center text-sm text-destructive gap-2 justify-center">
          {data?.error && data?.error.message}
          {error && error.message}
        </div>
      </main>
    );
  if (isLoading)
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
                  close={() => {
                    setShowAddMoneyForm(false);
                    refetch();
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
              money={showEditMoneyForm.money!}
              close={() => {
                setEditMoneyForm((prev) => ({
                  ...prev,
                  open: false,
                }));
                refetch();
              }}
            />
          </DrawerContent>
        </Drawer>
        {/* moneys list */}
        <div className="w-full flex flex-col gap-2 mt-2">
          {moneys?.map((money) => {
            return (
              <Money
                edit={() => setEditMoneyForm({ money: money, open: true })}
                done={() => refetch()}
                money={money}
                key={money.id}
                hideAmounts={listState.hideAmounts}
              />
            );
          })}
        </div>
        {/* charts */}
        {moneys?.length ? (
          <Card className="w-full mt-2 mb-24 rounded-lg shadow-none">
            <CardHeader className="px-2 py-4">
              <CardTitle>Total Breakdown </CardTitle>
            </CardHeader>
            <CardContent className="aspect-square p-2 max-h-[60vh] mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={moneys}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    fill="hsl(var(--foreground))"
                    dataKey="amount"
                    onMouseEnter={(_, i) => {
                      setActiveIndex(i);
                    }}
                  >
                    {moneys?.map((entry, index) => (
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
      </ScrollArea>
    </main>
  );
}
