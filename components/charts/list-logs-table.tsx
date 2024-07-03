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
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
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
    <motion.div
      initial={false}
      transition={{
        type: "spring",
        duration: 0.5,
        stiffness: 100,
        damping: 12,
      }}
      animate={open ? { height: 296 } : { height: 42 }}
    >
      <Card className={" rounded-lg shadow-none h-full flex flex-col"}>
        <CardHeader className="px-2 py-2">
          <button
            onClick={toggleOpen}
            className="flex items-start justify-between"
          >
            <div className="flex  flex-row justify-between items-center">
              <CardTitle className="flex items-center gap-1 py-1">
                <p className="font-bold">Logs</p>
                <motion.div
                  transition={{ type: "spring", duration: 0.5, stiffness: 100 }}
                  animate={open ? { rotate: 180 } : { rotate: 0 }}
                >
                  <ChevronDown className={"size-4"} />
                </motion.div>
              </CardTitle>
            </div>
          </button>
        </CardHeader>
        <CardContent
          className={`w-full h-full overflow-auto p-0 opacity-100 duration-500 animate-all ease-in-out ${!open && "pointer-events-none opacity-0"}`}
        >
          <ScrollArea className="h-full w-full p-2 pb-0">
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
                            {log.changes?.to.name} -{" "}
                            {UsePhpPesoWSign(log.changes?.to.amount)}
                          </>
                        ) : (
                          <div className="flex flex-col gap-2  w-fit">
                            {log.changes?.from.name !==
                              log.changes?.to.name && (
                              <div className="flex flex-row ">
                                <p className="flex-1">
                                  {log.changes?.from.name} to{" "}
                                  {log.changes?.to.name}
                                </p>
                              </div>
                            )}
                            {log.changes?.from.amount !==
                              log.changes?.to.amount && (
                              <div className="flex flex-row  ">
                                <p className="flex-1 w-fit ">
                                  {UsePhpPesoWSign(log.changes?.from.amount)} to{" "}
                                  {UsePhpPesoWSign(log.changes?.to.amount)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{log.reason}</TableCell>
                      <TableCell>
                        {UsePhpPesoWSign(log.changes?.to.total)}
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
    </motion.div>
  );
}