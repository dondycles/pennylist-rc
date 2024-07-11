"use server";

import { createClient } from "@/lib/supabase/server";

export async function log(
  type: string,
  reason: string,
  money: string,
  changes?: {
    from: { name: string; amount: string; total: string };
    to: { name: string; amount: string; total: string };
  },
) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("logs")
    .insert({ type, changes, reason, money })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: data.id };
}

export async function getLogs() {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("logs")
    .select("*, moneys(name,color,id)")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
