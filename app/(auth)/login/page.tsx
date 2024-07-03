import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import LoginForm from "./form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { currentVersion } from "@/lib/constants/version";

export default async function Login() {
  const supabase = createClient();

  const {
    data: { user: list },
  } = await supabase.auth.getUser();

  if (list) {
    return redirect("/list");
  }

  return (
    <div className="flex flex-col justify-center flex-1 w-full screen-x-padding h-full">
      <Button asChild className="w-fit mb-auto mt-4">
        <Link href="/">
          <ChevronLeft className="size-5" />
          Back
        </Link>
      </Button>
      <LoginForm />
      <footer className="flex flex-row flex-wrap justify-between w-full gap-4 p-4 text-sm text-muted-foreground mb-0 mt-auto">
        <Link href={"/"}>© pennylist. {currentVersion} | 2024 </Link>
        <div className="flex flex-row gap-4">
          <Link href={"/privacypolicy"}>Privacy Policy</Link>
          <Link href={"/termsandconditions"}>Terms and Conditions</Link>
        </div>
      </footer>
    </div>
  );
}
