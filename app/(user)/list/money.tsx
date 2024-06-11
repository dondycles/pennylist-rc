import { Database } from "@/database.types";
import { UsePhpPesoWSign } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { deleteMoney } from "@/app/actions/moneys";
import { useState } from "react";

export default function Money({
  money,
  done,
  edit,
}: {
  money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "user">;
  done: () => void;
  edit: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const { error } = await deleteMoney(money);
    if (error) return setIsPending(false);
    done();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          key={money.id}
          className={`p-2 border rounded-lg flex flex-row justify-between items-center font-bold ${
            isPending && "opacity-50 pointer-events-none "
          }`}
        >
          <p className="truncate  ">{money.name}</p>
          <p className="font-anton font-semibold">
            {UsePhpPesoWSign(money.amount ?? 0)}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleDelete}>Delete</ContextMenuItem>
        <ContextMenuItem onClick={() => edit()}>Edit</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
