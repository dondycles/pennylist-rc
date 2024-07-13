import Money from "@/components/money";
import { createClient } from "@/lib/supabase/server";

export default async function MoneyPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const {
    data: { user: list },
  } = await supabase.auth.getUser();

  return <Money moneyId={params.id} list={list} />;
}
