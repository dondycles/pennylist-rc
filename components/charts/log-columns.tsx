"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, Plus, Trash, PencilLine } from "lucide-react";
import { toMonthWord, UseAmountFormat } from "@/lib/utils";
import { ModifiedLogs } from "@/lib/hooks";
import { useListState } from "@/store";
import { Badge } from "../ui/badge";

type LogCols = ModifiedLogs;

export const logsColumns: ColumnDef<LogCols>[] = [
  {
    accessorKey: "type",
    header: "Action",
    cell: ({ getValue }) => {
      const action = String(getValue());
      return (
        (action === "add" && (
          <Plus size={16} className="m-auto text-green-500" />
        )) ||
        (action === "update" && (
          <PencilLine size={16} className="m-auto text-yellow-500" />
        )) ||
        (action === "delete" && (
          <Trash size={16} className="m-auto text-red-400" />
        )) ||
        null
      );
    },
  },
  {
    accessorKey: "money_name",
    header: "Money",
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className="whitespace-nowrap"
          style={{
            color: row.original.moneys?.color ?? "",
            borderColor: row.original.moneys?.color ?? "",
            backgroundColor: row.original.moneys?.color + "20",
          }}
        >
          {row.original.money_name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "changes",
    header: "Changes",
    cell: ({ cell }) => {
      const past = {
        rawAmount: cell.row.original.changes?.from.amount ?? 0,
        formattedAmount: UseAmountFormat(
          Number(cell.row.original.changes?.from.amount ?? 0),
          {
            hide: useListState.getState().hideAmounts,
            sign: true,
          },
        ),
        name: cell.row.original.changes?.from.name,
      };
      const current = {
        rawAmount: cell.row.original.changes?.to.amount ?? 0,
        formattedAmount: UseAmountFormat(
          Number(cell.row.original.changes?.to.amount ?? 0),
          {
            hide: useListState.getState().hideAmounts,
            sign: true,
          },
        ),
        name: cell.row.original.changes?.to.name,
      };

      const difference = {
        formattedAmount: UseAmountFormat(
          Math.abs(
            Number(past.rawAmount ?? 0) - Number(current.rawAmount ?? 0),
          ),
          {
            hide: useListState.getState().hideAmounts,
            sign: true,
          },
        ),
        rawAmount: Number(past.rawAmount ?? 0) - Number(current.rawAmount ?? 0),
      };
      return (
        <div className="flex flex-col gap-2 text-xs">
          <div
            className="font-readex font-black truncate"
            hidden={past.rawAmount === current.rawAmount}
          >
            {past.formattedAmount}{" "}
            <span className="font-raleway font-normal">to</span>{" "}
            {current.formattedAmount}
          </div>
          <div className="truncate" hidden={past.name === current.name}>
            {past.name} to {current.name}
          </div>
          <div
            className={`font-readex font-black truncate ${difference.rawAmount < 0 ? "text-green-500" : "text-red-400"}`}
            hidden={past.rawAmount === current.rawAmount}
          >
            {difference.rawAmount < 0
              ? "+" + difference.formattedAmount
              : "-" + difference.formattedAmount}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      return <span className="line-clamp-2">{row.original.reason}</span>;
    },
  },
  {
    accessorKey: "total",
    header: "Overall Total",
    cell: ({ row }) => {
      return (
        <span className="font-readex font-black">
          {UseAmountFormat(row.original.total ?? 0, {
            hide: useListState.getState().hideAmounts,
            sign: true,
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      const sortState = column.getIsSorted();
      return (
        <button
          className="flex gap-1 items-center"
          onClick={() => column.toggleSorting(sortState === "asc")}
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )}
        </button>
      );
    },
    cell: ({ getValue }) => {
      const date = String(getValue());
      return (
        <span className="whitespace-nowrap text-muted-foreground text-xs">
          {toMonthWord(date)}. {new Date(date).getDate()},{" "}
          {new Date(date).getFullYear()} at{" "}
          {new Date(date).toLocaleTimeString()}
        </span>
      );
    },
  },
];
