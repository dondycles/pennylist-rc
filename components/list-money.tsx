import { Database } from "@/database.types";
import { AsteriskNumber, UsePhpPeso } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { deleteMoney, setColor } from "@/app/actions/moneys";
import { useState } from "react";
import { TbCurrencyPeso } from "react-icons/tb";
import { Check, Info, Palette, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { colors } from "@/lib/constants/colors";
import Link from "next/link";

export default function Money({
  money,
  done,
  edit,
  hideAmounts,
  currentTotal,
}: {
  money: Omit<Database["public"]["Tables"]["moneys"]["Row"], "list">;
  done: () => void;
  edit: () => void;
  hideAmounts: boolean;
  currentTotal: string;
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [elevate, setElevate] = useState(false);

  const handleSetColor = async (color: string) => {
    const { error } = await setColor(money, color);
    if (error) console.log(error);
    done();
  };

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
            style={{
              borderColor: money.color ?? "",
              color: money.color ?? "",
              backgroundColor: money.color ? money.color + 20 : "",
            }}
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
          <ContextMenuSub>
            <ContextMenuSubTrigger style={{ color: money.color ?? "" }}>
              <Palette
                className="size-4 mr-1"
                style={{ color: money.color ?? "" }}
              />
              Color
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="p-0">
              <ContextMenuItem className="flex flex-row flex-wrap gap-1 p-1 max-w-[184px] bg-neutral-950  focus:bg-neutral-950">
                {Object.values(colors).map((color, i) => {
                  return (
                    <div className="flex flex-col gap-1" key={i}>
                      {Object.values(color).map((c) => {
                        return (
                          <button
                            onClick={() => handleSetColor(c)}
                            className="rounded size-4  hover:scale-125 scale-100 ease-in-out duration-150 transition-all"
                            style={{ backgroundColor: c }}
                            key={c}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuItem onClick={() => edit()}>
            <Pencil className="size-4 mr-1" />
            Edit
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <DialogTrigger className="w-full">
              <Trash className="size-4 mr-1 text-destructive" />
              <p className="text-destructive">Delete</p>
            </DialogTrigger>
          </ContextMenuItem>
          <ContextMenuItem asChild>
            <Link href={"/money/" + money.id}>
              <Info className="size-4 mr-1 " /> Details
            </Link>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <DialogContent className="p-2 w-fit">
        <DialogHeader>
          <DialogTitle className="text-destructive text-center font-black">
            Warning!
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Are you sure to delete? <br /> This will also delete its log
            history.
          </DialogDescription>
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
