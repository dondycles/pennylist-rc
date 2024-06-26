import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Database } from "@/database.types";
import { UsePhpPesoWSign } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};

export default function LogsTable({
  logs,
  open,
  toggleOpen,
}: {
  logs: Database["public"]["Tables"]["logs"]["Row"][];
  open: boolean;
  toggleOpen: () => void;
}) {
  return (
    <Collapsible onOpenChange={toggleOpen} open={open}>
      <Card className="overflow-x-hidden rounded-lg shadow-none">
        <CollapsibleTrigger>
          <CardHeader className="px-2 py-3 m-0">
            <CardTitle className="flex items-center gap-1">
              <p>Logs</p>

              <ChevronDown
                className={`size-4 ${open && "rotate-180"} transition-all`}
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="w-full overflow-auto p-0">
            <ScrollArea className="h-[512px]  w-full p-2">
              <Table className="w-full h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-fit">Action</TableHead>
                    <TableHead>Changes</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs?.map((log) => {
                    return (
                      <TableRow key={log.id}>
                        <TableCell
                          className={`${log.type === "add" && "text-green-500"}
                    ${log.type === "update" && "text-yellow-500"}
                    ${log.type === "delete" && "text-red-500"}
                    `}
                        >
                          {log.type}
                        </TableCell>
                        <TableCell>
                          {log.type === "add" ? (
                            <>
                              {(log.changes as changes).to.name} -{" "}
                              {UsePhpPesoWSign(
                                (log.changes as changes).to.amount
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col gap-2  w-fit">
                              {(log.changes as changes).from.name !==
                                (log.changes as changes).to.name && (
                                <div className="flex flex-row ">
                                  <p className="flex-1">
                                    {(log.changes as changes).from.name} to{" "}
                                    {(log.changes as changes).to.name}
                                  </p>
                                </div>
                              )}
                              {(log.changes as changes).from.amount !==
                                (log.changes as changes).to.amount && (
                                <div className="flex flex-row  ">
                                  <p className="flex-1 w-fit ">
                                    {UsePhpPesoWSign(
                                      (log.changes as changes).from.amount
                                    )}{" "}
                                    to{" "}
                                    {UsePhpPesoWSign(
                                      (log.changes as changes).to.amount
                                    )}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{log.reason}</TableCell>
                        <TableCell>
                          {UsePhpPesoWSign((log.changes as changes).to.total)}
                        </TableCell>
                        <TableCell>
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
