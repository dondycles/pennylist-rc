import List from "@/components/list";
import { createClient } from "@/lib/supabase/server";

export default async function ListPage() {
  const supabase = createClient();

  const {
    data: { user: list },
  } = await supabase.auth.getUser();

  return <List list={list} />;
}
