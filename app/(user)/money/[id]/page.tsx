import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Money from "./_components/money";

export default async function MoneyPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user: list },
  } = await supabase.auth.getUser();

  if (!list) {
    return redirect("/login");
  }

  return <Money list={list} moneyId={params.id} />;
}
