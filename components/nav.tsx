import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Home, LogOut } from "lucide-react";
import { logout } from "../app/actions/auth/log-out";
import { useQueryClient } from "@tanstack/react-query";

import TooltipC from "@/components/tooltip";
import { useListState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
export default function Nav() {
  const queryClient = useQueryClient();
  const listState = useListState();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  return (
    <nav
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg border bg-background p-1 flex gap-1  transition-all ease-in-out ${
        pathname !== "/list" ? "w-[166px]" : "w-[126px]"
      }`}
    >
      {pathname !== "/list" && (
        <TooltipC text="back">
          <Button asChild variant={"ghost"} size={"icon"}>
            <Link href={"/list"}>
              <Home size={20} />
            </Link>
          </Button>
        </TooltipC>
      )}
      <TooltipC text="Toggle theme">
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          variant="ghost"
          size="icon"
        >
          <Sun
            size={20}
            className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <Moon
            size={20}
            className="absolute  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipC>
      <TooltipC text="Show/hide money">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => listState.toggleHideAmounts()}
        >
          {!listState.hideAmounts ? <EyeOff size={20} /> : <Eye size={20} />}
        </Button>
      </TooltipC>
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
    </nav>
  );
}
