"use server";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";

type money = Database["public"]["Tables"]["moneys"]["Row"];

export async function getMoneys(sort: {
  asc: boolean;
  by: "created_at" | "amount";
}) {
  const supabase = createClient();
  const moneys = await supabase
    .from("moneys")
    .select("id,amount,name,created_at,color,updated_at")
    .order(sort.by, { ascending: sort.asc });
  return moneys;
}

export async function addMoney(money: Pick<money, "amount" | "name">) {
  const supabase = createClient();

  const { error } = await supabase.from("moneys").insert(money);
  if (error) return { error };
  return { success: "added!" };
}

export async function editMoney(money: Omit<money, "user">) {
  const supabase = createClient();

  const { error } = await supabase
    .from("moneys")
    .update(money)
    .eq("id", money.id);
  if (error) return { error };
  return { success: "edited!" };
}

export async function deleteMoney(money: Pick<money, "id">) {
  const supabase = createClient();

  const { error } = await supabase.from("moneys").delete().eq("id", money.id);
  if (error) return { error };
  return { success: "deleted!" };
}
