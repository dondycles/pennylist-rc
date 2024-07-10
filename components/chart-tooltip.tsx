import { UsePhpPesoWSign } from "@/lib/utils";

export default function ChartTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = Number(payload[0]?.value);
    const gainOrLoss = data.gainOrLoss;
    const gainSum = data.gainsSum;
    const expensesSum = data.expensesSum;
    return (
      <div className="rounded-lg p-2 text-sm bg-muted flex flex-col gap-2  border shadow-lg max-w-[244px]">
        <p className="text-muted-foreground">{data.date}</p>
        <div className="text-xs flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <div className="bg-green-500/50 w-3 h-1" /> Gain
            </div>
            <div className="font-anton font-black">
              {UsePhpPesoWSign(gainSum)}
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <div className="bg-red-500/50 w-3 h-1" />
              Loss
            </div>
            <div className="font-anton font-black">
              {UsePhpPesoWSign(expensesSum)}
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <div className="bg-gradient-to-b from-green-500 to-red-400 size-3 rounded" />
              Difference
            </div>
            <div className="font-anton font-black">
              {UsePhpPesoWSign(gainOrLoss)}
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              <div className="bg-gradient-to-b from-primary to-transparent size-3 rounded" />
              Current Total
            </div>
            <div className="font-anton font-black">
              {UsePhpPesoWSign(total)}
            </div>
          </div>
        </div>
        <p className="text-muted-foreground text-[10px] leading-tight text-wrap text-justify">
          Difference is equal to gain minus loss and also equal to the
          difference of current total from previous total.
        </p>
      </div>
    );
  }

  return null;
}
