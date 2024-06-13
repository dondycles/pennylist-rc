import { createClient } from "@/utils/supabase/server";
import List from "./list";
import { redirect } from "next/navigation";

export default async function ListPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
  return <List user={user} />;
}
