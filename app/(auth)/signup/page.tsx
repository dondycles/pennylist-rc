import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import SignupForm from "./form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SignUp() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/list");
  }
  return (
    <div className="flex flex-col justify-center flex-1 w-full screen-x-padding p-4 h-full">
      <Button asChild className="w-fit mb-auto">
        <Link href="/">
          <ChevronLeft className="size-5" />
          Back
        </Link>
      </Button>
      <SignupForm />
    </div>
  );
}
