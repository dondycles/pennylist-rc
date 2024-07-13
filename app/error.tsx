"use client";
import { Button } from "@/components/ui/button";
import { logout } from "./_actions/auth";
import { useQueryClient } from "@tanstack/react-query";
// Error components must be Client Components

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  const queryClient = useQueryClient();
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      <h2 className="text-destructive font-black text-2xl">
        Something went wrong!
      </h2>
      <p className="text-sm text-muted-foreground max-w-[300px] text-center">
        {error.message}
      </p>
      <div className="flex gap-2 mt-4">
        <Button
          variant={"secondary"}
          onClick={async () => {
            queryClient.clear();
            await logout();
          }}
        >
          Log out
        </Button>
        <Button
          onClick={() => {
            if (!window) return;
            window.location.reload();
          }}
        >
          Reload
        </Button>
      </div>
    </div>
  );
}
