"use server";

import { LogChangesTypes, Reason, UUIDType } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function log(
  type: string,
  reason: z.infer<typeof Reason>,
  moneyId: z.infer<typeof UUIDType>,
  changes?: z.infer<typeof LogChangesTypes>,
) {
  const moneyIdParse = UUIDType.safeParse(moneyId);
  const reasonParse = Reason.safeParse(reason);
  const changesParse = LogChangesTypes.safeParse(changes);

  if (!moneyIdParse.success) {
    return {
      error: moneyIdParse.error.issues[0].message,
    };
  }
  if (!reasonParse.success) {
    return {
      error: reasonParse.error.issues[0].message,
    };
  }
  if (!changesParse.success) {
    return {
      error: changesParse.error.issues[0].message,
    };
  }

  const supabase = createClient();
  const { error, data } = await supabase
    .from("logs")
    .insert({ type, changes, reason, money: moneyId })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: data.id };
}

export async function getLogs(id: z.infer<typeof UUIDType>) {
  const supabase = createClient();
  const logs = await supabase
    .from("logs")
    .select("*, moneys(name,color,id)")
    .eq("list", id)
    .order("created_at", { ascending: false })
    .limit(100);
  return logs;
}
