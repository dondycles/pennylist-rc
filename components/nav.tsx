import { Button } from "@/components/ui/button";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CalendarCheck,
  Eye,
  EyeOff,
  Gem,
  Home,
  ListFilter,
  LogOut,
  Settings,
} from "lucide-react";
import { logout } from "@/app/_actions/auth";
import { useQueryClient } from "@tanstack/react-query";

import { useListState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

export default function Nav() {
  const queryClient = useQueryClient();
  const listState = useListState();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  return (
    <motion.nav
      layout
      transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
      animate={
        pathname !== "/list" ? { width: 36 * 3 + 10 } : { width: 36 * 2 + 10 }
      }
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg border bg-background p-1 flex justify-end`}
    >
      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <AnimatePresence initial={false}>
          {pathname !== "/list" && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, scale: 0, x: 40 }}
            >
              <Button asChild variant={"ghost"} size={"icon"}>
                <Link href={"/list"}>
                  <Home size={20} />
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <Popover open={showSettings} onOpenChange={setShowSettings}>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <motion.div
                animate={showSettings ? { rotate: 90 } : { rotate: 0 }}
              >
                <Settings size={20} />
              </motion.div>
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={10} className="p-1 flex flex-col w-fit">
            <motion.div
              transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
              whileTap={{ scale: 0.8 }}
            >
              <Button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                variant="ghost"
                size="icon"
              >
                <motion.div
                  initial={false}
                  key={"theme"}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
                  animate={theme === "light" ? { rotate: 180 } : { rotate: 0 }}
                >
                  <Sun size={20} className="dark:hidden block" />
                  <Moon size={20} className="hidden dark:block" />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.5,
              }}
              whileTap={{ scale: 0.8 }}
            >
              <DropdownMenu
                onOpenChange={(state) => {
                  if (!state) {
                    setShowSettings(false);
                  }
                }}
              >
                <DropdownMenuTrigger asChild>
                  <Button size={"icon"} variant={"ghost"}>
                    <ListFilter size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" sideOffset={10}>
                  <DropdownMenuCheckboxItem
                    checked={listState.sort.by === "amount"}
                    onClick={() => {
                      listState.setSort(listState.sort.asc, "amount");
                      setShowSettings(false);
                    }}
                    className="text-xs"
                  >
                    <Gem className="size-4 mr-1" />
                    Value
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={listState.sort.by === "created_at"}
                    onClick={() => {
                      listState.setSort(listState.sort.asc, "created_at");
                      setShowSettings(false);
                    }}
                    className="text-xs"
                  >
                    <CalendarCheck className="size-4 mr-1" />
                    Date created
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={listState.sort.asc}
                    onClick={() => {
                      listState.setSort(true, listState.sort.by);
                      setShowSettings(false);
                    }}
                    className="text-xs"
                  >
                    <ArrowUpNarrowWide className="size-4 mr-1" />
                    Ascending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={!listState.sort.asc}
                    onClick={() => {
                      listState.setSort(false, listState.sort.by);
                      setShowSettings(false);
                    }}
                    className="text-xs"
                  >
                    <ArrowDownNarrowWide className="size-4 mr-1" />
                    Descending
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
            <motion.div
              transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
              whileTap={{ scale: 0.8 }}
            >
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => listState.toggleHideAmounts()}
              >
                {!listState.hideAmounts ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </Button>
            </motion.div>
          </PopoverContent>
        </Popover>
      </motion.div>
      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <Button
          variant={"ghost"}
          onClick={async (e) => {
            e.currentTarget.classList.add(`opacity-50`);
            e.currentTarget.classList.add(`pointer-events-none`);
            queryClient.clear();
            await logout();
          }}
          size={"icon"}
        >
          <LogOut size={20} />
        </Button>
      </motion.div>
    </motion.nav>
  );
}
