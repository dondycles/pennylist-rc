import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
type changes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
};

export default function LogsTable({
  logs,
}: {
  logs: Database["public"]["Tables"]["logs"]["Row"][];
}) {
  return (
    <Card className="mt-2 overflow-x-hidden rounded-lg shadow-none">
      <CardHeader className="py-4 px-2">
        <CardTitle>Logs</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0 overflow-auto">
        <ScrollArea className="h-[512px]  w-full">
          <Table className="w-full h-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-fit">Action</TableHead>
                <TableHead>Changes</TableHead>
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
                          {UsePhpPesoWSign((log.changes as changes).to.amount)}
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
    </Card>
  );
}
