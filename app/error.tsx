"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "./_actions/auth";
// Error components must be Client Components

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-4">
      <h2 className="text-destructive font-black text-2xl">
        Something went wrong!
      </h2>
      <p className="text-sm text-muted-foreground max-w-[300px] text-center">
        {error.message}
      </p>
      <div className="flex gap-2 mt-4">
        <Button variant={"ghost"} onClick={async () => await logout()}>
          Log out
        </Button>
        <Button asChild>
          <Link href={"/list"}>Home</Link>
        </Button>
      </div>
    </div>
  );
}
