import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Home, LogOut } from "lucide-react";
import { logout } from "../../actions/auth/log-out";
import { useQueryClient } from "@tanstack/react-query";

import TooltipC from "@/components/tooltip";
import { useListState } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const queryClient = useQueryClient();
  const listState = useListState();
  const pathname = usePathname();
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
        <ThemeToggle />
      </TooltipC>
      <TooltipC text="Show/hide money">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => listState.toggleHideAmounts()}
        >
          {!listState.hideAmounts ? <EyeOff size={18} /> : <Eye size={18} />}
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
