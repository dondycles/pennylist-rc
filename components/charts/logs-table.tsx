import {
  ArrowRightLeft,
  PencilLine,
  Plus,
  ScrollText,
  Trash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { toMonthWord, UseAmountFormat } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useListState } from "@/store";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { ModifiedLogs } from "@/lib/types";
import { Button } from "../ui/button";

export default function LogsTable({ logs }: { logs: ModifiedLogs[] }) {
  const [filterBy, setFilterBy] = useState<
    "type" | "created_at" | "name" | "reason"
  >("name");
  const [filterValue, setFilterValue] = useState("");
  const [actionFilter, setActionFilter] = useState<
    "" | "Delete" | "Add" | "Update" | "Transfer"
  >("");
  const listState = useListState();

  return (
    <Card className="shadow-none rounded-lg">
      <CardHeader className="p-2 border-b">
        <CardTitle className="flex items-center gap-1 py-1 text-muted-foreground font-normal text-sm">
          <ScrollText size={20} /> Logs (Last 100)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col">
        <div className="p-2 flex gap-2">
          <div className="flex items-center flex-1 border rounded-md h-8">
            <Input
              placeholder={`Filter by ` + filterBy}
              className="rounded-r-none border-none py-1 h-8 z-10"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
            <Separator orientation="vertical" className="z-0" />
            <DropdownMenu>
              <DropdownMenuTrigger className=" rounded-r-md px-2">
                <CaretSortIcon className="text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="bottom"
                className="text-muted-foreground"
                sideOffset={14}
              >
                <DropdownMenuCheckboxItem
                  checked={filterBy === "name"}
                  onCheckedChange={() => setFilterBy("name")}
                  className="capitalize text-xs"
                >
                  Money name
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBy === "reason"}
                  onCheckedChange={() => setFilterBy("reason")}
                  className="capitalize text-xs"
                >
                  Reason
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={filterBy === "created_at"}
                  onCheckedChange={() => setFilterBy("created_at")}
                  className="capitalize text-xs"
                >
                  Date
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"sm"} variant={"outline"} className="shadow-none">
                Action
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="text-muted-foreground min-w-0 w-20"
            >
              <DropdownMenuCheckboxItem
                onCheckedChange={() => setActionFilter("")}
                checked={actionFilter === ""}
                className=" text-xs"
              >
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => setActionFilter("Add")}
                checked={actionFilter === "Add"}
                className=" text-xs"
              >
                <Plus size={16} className=" text-green-500" />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => setActionFilter("Update")}
                checked={actionFilter === "Update"}
                className=" text-xs"
              >
                <PencilLine size={16} className=" text-yellow-500" />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => setActionFilter("Transfer")}
                checked={actionFilter === "Transfer"}
                className=" text-xs"
              >
                <ArrowRightLeft size={16} className=" text-blue-400" />
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={() => setActionFilter("Delete")}
                checked={actionFilter === "Delete"}
                className=" text-xs"
              >
                <Trash size={16} className=" text-red-400" />
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ScrollArea className="h-[50dvh] px-2 py-0 ">
          {logs
            .filter(
              (log) =>
                (filterBy === "created_at" &&
                  log.created_at.match(filterValue)) ||
                (filterBy === "name" && log.money_name?.match(filterValue)) ||
                (filterBy === "reason" && log.reason?.match(filterValue)),
            )
            .filter((log) => log.type.match(actionFilter.toLowerCase()))
            ?.map((log) => {
              return (
                <Card
                  key={log.id}
                  className="rounded-lg shadow-none text-sm mb-2"
                >
                  <CardContent className="p-2 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <div>
                        {(log.type === "add" && (
                          <Plus size={16} className=" text-green-500" />
                        )) ||
                          (log.type === "update" && (
                            <PencilLine
                              size={16}
                              className=" text-yellow-500"
                            />
                          )) ||
                          (log.type === "delete" && (
                            <Trash size={16} className=" text-red-400" />
                          )) ||
                          (log.type === "transfer" && (
                            <ArrowRightLeft
                              size={16}
                              className=" text-blue-400"
                            />
                          )) ||
                          null}
                      </div>
                      <p className="text-muted-foreground truncate text-xs">
                        {toMonthWord(log.created_at)}.{" "}
                        {new Date(log.created_at).getDate()},{" "}
                        {new Date(log.created_at).getFullYear()} at{" "}
                        {new Date(log.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 justify-between">
                      <p className="truncate">{log.reason}</p>
                      <p className="font-readex">
                        {Number(log.changes.from.amount) -
                          Number(log.changes.to.amount) <=
                        0
                          ? "+"
                          : "-"}
                        {UseAmountFormat(
                          Math.abs(
                            Number(log.changes.from.amount) -
                              Number(log.changes.to.amount),
                          ),
                          { sign: true, hide: listState.hideAmounts },
                        )}
                      </p>
                    </div>
                    <Separator />
                    <div className="text-xs text-muted-foreground">
                      <p>
                        Money: {log.changes.to.name ?? log.changes.from.name}
                      </p>
                      <div
                        hidden={
                          (log.changes.from.name === log.changes.to.name &&
                            log.changes.from.amount) ===
                            log.changes.to.amount ||
                          log.type === "add" ||
                          log.type === "delete"
                        }
                      >
                        <div className="flex flex-row gap-1">
                          Changes:{" "}
                          <p
                            hidden={
                              log.changes.from.name === log.changes.to.name
                            }
                          >
                            {log.changes.from.name +
                              " to " +
                              log.changes.to.name}
                          </p>
                          <p
                            hidden={
                              log.changes.from.amount === log.changes.to.amount
                            }
                          >
                            {UseAmountFormat(log.changes.from.amount, {
                              sign: true,
                              hide: listState.hideAmounts,
                            }) +
                              " to " +
                              UseAmountFormat(log.changes.to.amount, {
                                sign: true,
                                hide: listState.hideAmounts,
                              })}
                          </p>
                        </div>
                      </div>
                      <p>
                        Total money:{" "}
                        {UseAmountFormat(log.changes.to.total, {
                          sign: true,
                          hide: listState.hideAmounts,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
