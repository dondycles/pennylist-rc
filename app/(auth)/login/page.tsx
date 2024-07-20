import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import LoginForm from "./form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/footer";

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
      <Footer />
    </div>
  );
}
