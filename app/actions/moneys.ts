"use server";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/server";
import { log } from "./logs";

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

export async function addMoney(
  money: Pick<money, "amount" | "name">,
  currentTotal: string
) {
  const supabase = createClient();

  const { error } = await supabase.from("moneys").insert(money);
  if (error) return { error: error.message };

  const { error: logError } = await log("add", "add", {
    from: {
      amount: "",
      name: "",
      total: String(currentTotal),
    },
    to: {
      amount: String(money.amount),
      name: money.name,
      total: String(currentTotal + money.amount),
    },
  });

  if (logError) return { logError };

  return { success: "added!" };
}

export async function editMoney(
  updatedMoney: Omit<money, "user">,
  lastMoney: Omit<money, "user">,
  currentTotal: string,
  reason: string
) {
  if (
    updatedMoney.amount === lastMoney.amount &&
    updatedMoney.name === lastMoney.name
  )
    return { success: "edited!" };

  const supabase = createClient();

  const { error } = await supabase
    .from("moneys")
    .update(updatedMoney)
    .eq("id", updatedMoney.id);
  if (error) return { error: error.message };

  const { error: logError } = await log("update", reason, {
    from: {
      amount: String(lastMoney.amount),
      name: lastMoney.name,
      total: String(currentTotal),
    },
    to: {
      amount: String(updatedMoney.amount),
      name: updatedMoney.name,
      total: String(
        Number(currentTotal) +
          (Number(updatedMoney.amount) - Number(lastMoney.amount))
      ),
    },
  });

  if (logError) return { logError };

  return { success: "edited!" };
}

export async function deleteMoney(
  money: Pick<money, "id" | "amount" | "name">,
  currentTotal: string
) {
  const supabase = createClient();

  const { error } = await supabase.from("moneys").delete().eq("id", money.id);
  if (error) return { error: error.message };

  const { error: logError } = await log("delete", "delete", {
    from: {
      amount: String(money.amount),
      name: money.name,
      total: String(currentTotal),
    },
    to: {
      amount: "",
      name: "",
      total: String(Number(currentTotal) - Number(money.amount)),
    },
  });
  if (logError) return { logError };

  return { success: "deleted!" };
}

export async function setColor(money: Pick<money, "id">, color: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("moneys")
    .update({ color })
    .eq("id", money.id);

  if (error) return { error: error.message };
  return { success: "colored!" };
}
