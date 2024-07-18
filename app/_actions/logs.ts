"use server";

import { Reason, UUIDType } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function log(
  type: string,
  reason: z.infer<typeof Reason>,
  moneyId: z.infer<typeof UUIDType>,
  changes?: {
    from: { name: string; amount: number; total: number };
    to: { name: string; amount: number; total: number };
  },
) {
  const supabase = createClient();
  const { error, data } = await supabase
    .from("logs")
    .insert({ type, changes, reason, money: moneyId })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: data.id };
}

export async function getLogs() {
  const supabase = createClient();
  const logs = await supabase
    .from("logs")
    .select("*, moneys(name,color,id)")
    .order("created_at", { ascending: false })
    .limit(100);
  return logs;
}
