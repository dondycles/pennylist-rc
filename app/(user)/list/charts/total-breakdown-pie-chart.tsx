import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Database } from "@/database.types";
import { UsePhpPesoWSign } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";

export default function TotalBreakdownPieChart({
  moneys,
  open,
  toggleOpen,
}: {
  moneys: Omit<Database["public"]["Tables"]["moneys"]["Row"], "list">[];
  open: boolean;
  toggleOpen: () => void;
}) {
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
    <Collapsible onOpenChange={toggleOpen} open={open}>
      <Card className="w-full rounded-lg shadow-none">
        <CollapsibleTrigger>
          <CardHeader className="px-2 py-3">
            <CardTitle className="flex items-center gap-1">
              <p>Total Breakdown</p>

              <ChevronDown
                className={`size-4 ${open && "rotate-180"} transition-all`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {moneys.length ? (
            <CardContent className="aspect-square p-2 max-h-[60vh] mx-auto">
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
