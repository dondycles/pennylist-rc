import { Database } from "@/database.types";
import { AsteriskNumber, UsePhpPeso, UsePhpPesoWSign } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  ContextMenuSubContent,
  ContextMenuSub,
} from "@/components/ui/context-menu";
import { deleteMoney } from "@/app/actions/moneys";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { Check, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

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
  const [showWarning, setShowWarning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [elevate, setElevate] = useState(false);
  const handleDelete = async () => {
    setIsPending(true);
    const { error } = await deleteMoney(money, currentTotal);
    if (error) return setIsPending(false);
    done();
  };

  return (
    <Dialog key={money.id} open={showWarning} onOpenChange={setShowWarning}>
      <ContextMenu key={money.id} onOpenChange={setElevate}>
        <ContextMenuTrigger>
          <div
            key={money.id}
            className={`p-2 border rounded-lg flex flex-row justify-between items-center font-bold ${
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
          <ContextMenuItem onClick={() => edit()} className="text-xs">
            <Pencil className="size-4 mr-1" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem className="text-xs" asChild>
            <DialogTrigger className="w-full">
              <Trash className="size-4 mr-1 text-destructive" />
              <span className="text-destructive">Delete</span>
            </DialogTrigger>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent className="p-2 w-fit">
        <DialogHeader>
          <DialogTitle className="text-destructive text-center">
            Warning!
          </DialogTitle>
          <DialogDescription>Are you sure to delete?</DialogDescription>
          <div
            key={money.id}
            className={`p-2 border rounded-lg flex flex-row justify-between items-center font-bold ${
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
          <div className="flex gap-2">
            <Button
              disabled={isPending}
              onClick={handleDelete}
              className="flex-1"
              variant={"destructive"}
            >
              <Check className="size-4" />
            </Button>
            <Button
              disabled={isPending}
              onClick={() => setShowWarning(false)}
              className="flex-1"
              variant={"outline"}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
