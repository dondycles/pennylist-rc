"use server";

import { createClient } from "@/utils/supabase/server";

export async function log(
  type: string,
  changes?: {
    from: { name: string; amount: string; total: string };
    to: { name: string; amount: string; total: string };
  }
) {
  const supabase = createClient();
  const { error } = await supabase.from("logs").insert({ type, changes });

  if (error) return { error: error.message };
  return { success: "Logged" };
}

export async function getLogs() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
