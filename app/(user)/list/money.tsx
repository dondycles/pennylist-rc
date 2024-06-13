import { Database } from "@/database.types";
import { AsteriskNumber, UsePhpPeso, UsePhpPesoWSign } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { deleteMoney } from "@/app/actions/moneys";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";

export default function Money({
  money,
  done,
  edit,
  hideAmounts,
  currentTotal,
}: {
  money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user">;
  done: () => void;
  edit: () => void;
  hideAmounts: boolean;
  currentTotal: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const [elevate, setElevate] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const { error } = await deleteMoney(money, currentTotal);
    if (error) return setIsPending(false);
    done();
  };

  return (
    <ContextMenu onOpenChange={setElevate}>
      <ContextMenuTrigger>
        <div
          key={money.id}
          className={` p-2 border rounded-lg flex flex-row justify-between items-center font-bold ${
            isPending && "opacity-50 pointer-events-none "
          } ${
            elevate ? "shadow-lg scale-[100.5%]" : "shadow-none"
          } ease-in-out transition-all`}
        >
          <p className="truncate">{money.name}</p>
          <div className="font-semibold font-anton flex items-center">
            <TbCurrencyPeso />
            {hideAmounts
              ? AsteriskNumber(money.amount ?? 0)
              : UsePhpPeso(money.amount ?? 0)}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        <ContextMenuItem onClick={() => edit()}>Edit</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
