import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Columns, ScrollText } from "lucide-react";
import { useEffect, useState } from "react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}
export default function LogsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [filterBy, setFilterBy] = useState<string>("reason");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });
  useEffect(() => {
    table
      .getAllColumns()
      .filter((column) => column.getCanHide())
      .map((column) => {
        table.getColumn(column.id)?.setFilterValue("");
      });
  }, [filterBy, table]);
  return (
    <Card className="rounded-lg shadow-none">
      <CardHeader className="p-2 border-b">
        <CardTitle className="flex items-center gap-1 py-1 text-muted-foreground font-normal text-sm">
          <ScrollText size={20} /> Logs (Last 100)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 grid">
        <div className="flex flex-row flex-wrap gap-2 mb-2">
          <div className="flex items-center flex-1 border rounded-md shadow-sm">
            <Input
              placeholder={`Filter by ${
                filterBy === "money_name"
                  ? "money"
                  : filterBy === "created_at"
                    ? "date added"
                    : filterBy
              }`}
              value={
                (table.getColumn(filterBy)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(filterBy)?.setFilterValue(event.target.value)
              }
              className="rounded-r-none border-none py-1 h-8 z-10"
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
                {table
                  .getAllColumns()
                  .filter((column) => column.getIsVisible())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-xs"
                        checked={filterBy === column.id}
                        onCheckedChange={() => setFilterBy(column.id)}
                      >
                        {column.id === "money_name"
                          ? "money"
                          : column.id === "created_at"
                            ? "date added"
                            : column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-fit text-muted-foreground font-normal gap-1"
              >
                View <Columns size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-muted-foreground">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "money_name"
                        ? "money"
                        : column.id === "created_at"
                          ? "date added"
                          : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table>
          <TableHeader className="text-xs ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="shrink-0" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="p-2 justify-center gap-2">
        <p className="text-xs text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </p>
        <Button
          variant="outline"
          size="icon"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft size={20} />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight size={20} />
        </Button>
      </CardFooter>
    </Card>
  );
}
