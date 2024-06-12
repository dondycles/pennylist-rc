import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "../actions/auth/log-out";
import { useQueryClient } from "@tanstack/react-query";

export default function Nav() {
  const queryClient = useQueryClient();
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-lg shadow-lg border bg-background p-2 flex gap-2">
      <ThemeToggle />
      <Button
        onClick={async (e) => {
          e.currentTarget.classList.add(`opacity-50`);
          e.currentTarget.classList.add(`pointer-events-none`);
          const { error } = await logout();
          if (error) {
            e.currentTarget.classList.remove(`opacity-50`);
            e.currentTarget.classList.remove(`pointer-events-none`);
          }
          queryClient.clear();
        }}
        size={"icon"}
      >
        <LogOut size={20} />
      </Button>
    </nav>
  );
}
