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

export default function LogsTable({
  logs,
}: {
  logs: Database["public"]["Tables"]["logs"]["Row"][];
}) {
  return (
    <Card className="overflow-x-hidden rounded-lg shadow-none">
      <CardHeader className="px-2 py-3 m-0">
        <CardTitle className="flex items-center gap-1">
          <p className="font-bold">Logs</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full overflow-auto p-0">
        <div className="overflow-auto h-full w-full grid">
          <ScrollArea className="h-[512px] w-full p-2">
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
                            {log?.changes?.to.name} -{" "}
                            {UsePhpPesoWSign(log?.changes?.to.amount)}
                          </>
                        ) : (
                          <div className="flex flex-col gap-2  w-fit">
                            {log?.changes?.from.name !==
                              log?.changes?.to.name && (
                              <div className="flex flex-row ">
                                <p className="flex-1">
                                  {log?.changes?.from.name} to{" "}
                                  {log?.changes?.to.name}
                                </p>
                              </div>
                            )}
                            {log?.changes?.from.amount !==
                              log?.changes?.to.amount && (
                              <div className="flex flex-row  ">
                                <p className="flex-1 w-fit ">
                                  {UsePhpPesoWSign(log?.changes?.from.amount)}{" "}
                                  to {UsePhpPesoWSign(log?.changes?.to.amount)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>
                        {UsePhpPesoWSign(log?.changes?.to.total)}
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
        </div>
      </CardContent>
    </Card>
  );
}
