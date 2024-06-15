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
}: {
  moneys: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user">[];
}) {
  const [collapse, setCollapse] = useState(false);
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
          style={{ fontWeight: "bold", fontSize: "0.8rem" }}
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
  return (
    <Collapsible onOpenChange={setCollapse}>
      <Card className="w-full rounded-lg shadow-none">
        <CollapsibleTrigger>
          <CardHeader className="px-2 py-3">
            <CardTitle className="flex items-center gap-1">
              <p>Total Breakdown</p>

              <ChevronDown
                className={`size-4 ${collapse && "rotate-180"} transition-all`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
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
                  {moneys?.map((_, index) => (
                    <Cell
                      className="fill-background stroke-foreground stroke-2"
                      key={`cell-${index}`}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
