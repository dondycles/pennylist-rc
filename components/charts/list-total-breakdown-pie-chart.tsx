import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Database } from "@/database.types";
import { UseAmountFormat } from "@/lib/utils";
import { useListState } from "@/store";
import { PieChartIcon } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
export default function TotalBreakdownPieChart({
  moneys,
}: {
  moneys: Omit<Database["public"]["Tables"]["moneys"]["Row"], "list">[];
}) {
  const listState = useListState();
  const [activeIndex, setActiveIndex] = useState(1);
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
          style={{
            fontSize: "0.8rem",
            stroke: payload.color,
          }}
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
          {UseAmountFormat(Number(value ?? 0), {
            hide: listState.hideAmounts,
            sign: true,
          })}
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
          startAngle={startAngle + 1}
          endAngle={endAngle - 1}
          fill={payload.color ?? "hsl(var(--primary))"}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 4}
          outerRadius={outerRadius + 8}
          fill={payload.color ?? "hsl(var(--primary))"}
        />
      </g>
    );
  };
  return (
    <Card
      className={
        "overflow-hidden rounded-lg shadow-none w-full aspect-square flex flex-col"
      }
    >
      <CardHeader className="p-2 mb-2 border-b">
        <div className="flex items-start justify-between">
          <div className="flex  flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-1 py-1 text-muted-foreground font-normal text-sm">
              <PieChartIcon size={20} /> Total Breakdown
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      {moneys.length ? (
        <CardContent
          className={`p-2 flex-1 w-full transition-all duration-500 ease-in-out opacity-100`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                animationBegin={0}
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
                {moneys?.map((money, index) => (
                  <Cell
                    style={{
                      strokeWidth: 1,
                      stroke: money.color ?? "hsl(var(--primary))",
                      fill: money.color ? money.color + 20 : "",
                    }}
                    className="fill-background"
                    key={`cell-${index}`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      ) : (
        <CardContent className="p-2 w-full text-center text-sm text-muted-foreground">
          <p>No records</p>
        </CardContent>
      )}
    </Card>
  );
}
