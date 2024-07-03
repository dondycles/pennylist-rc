import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Home, Lightbulb, LogOut } from "lucide-react";
import { logout } from "../app/actions/auth/log-out";
import { useQueryClient } from "@tanstack/react-query";

import TooltipC from "@/components/tooltip";
import { useListState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
export default function Nav() {
  const queryClient = useQueryClient();
  const listState = useListState();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  return (
    <motion.nav
      layout
      transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
      animate={pathname !== "/list" ? { width: 166 } : { width: 126 }}
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg border bg-background p-1 flex justify-end gap-1`}
    >
      <AnimatePresence initial={false}>
        <motion.div
          transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
          whileTap={{ scale: 0.8 }}
        >
          {pathname !== "/list" && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 0 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, scale: 0, x: 40 }}
            >
              <TooltipC text="back">
                <Button asChild variant={"ghost"} size={"icon"}>
                  <Link href={"/list"}>
                    <Home size={20} />
                  </Link>
                </Button>
              </TooltipC>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <TooltipC text="Toggle theme">
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
        </TooltipC>
      </motion.div>
      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <TooltipC text="Show/hide money">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => listState.toggleHideAmounts()}
          >
            {!listState.hideAmounts ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </TooltipC>
      </motion.div>
      <motion.div
        transition={{ type: "spring", duration: 0.5, bounce: 0.5 }}
        whileTap={{ scale: 0.8 }}
      >
        <TooltipC text="Logout">
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
        </TooltipC>
      </motion.div>
    </motion.nav>
  );
}
