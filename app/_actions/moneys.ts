"use server";
import { Database } from "@/database.types";
import { createClient } from "@/lib/supabase/server";
import { log } from "./logs";

type money = Database["public"]["Tables"]["moneys"]["Row"];

export async function getTotal() {
  const supabase = createClient();
  const total = await supabase.rpc("getTotal");
  return total;
}

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

export async function getMoney(id: string) {
  const supabase = createClient();
  const money = await supabase
    .from("moneys")
    .select(
      "id,amount,name,created_at,color,updated_at, logs(*, moneys(id,name,color))",
    )
    .eq("id", id)
    .order("created_at", { ascending: false, referencedTable: "logs" })
    .limit(100, { referencedTable: "logs" })
    .single();
  return money;
}

export async function addMoney(
  money: Pick<money, "amount" | "name">,
  currentTotal: number,
) {
  const supabase = createClient();

  const { error, data } = await supabase
    .from("moneys")
    .insert(money)
    .select("id")
    .single();
  if (error) return { error: error.message };

  const { error: logError } = await log("add", "add", data.id, {
    from: {
      amount: "",
      name: "",
      total: String(currentTotal),
    },
    to: {
      amount: String(money.amount),
      name: money.name,
      total: String(Number(currentTotal) + Number(money.amount)),
    },
  });

  if (logError) return { logError };

  return { success: "added!" };
}

export async function editMoney(
  updatedMoney: Omit<money, "list">,
  lastMoney: Omit<money, "list">,
  currentTotal: string,
  reason: string,
  money: string,
) {
  if (
    updatedMoney.amount === lastMoney.amount &&
    updatedMoney.name === lastMoney.name
  )
    return { error: "No changes made!" };

  const supabase = createClient();

  const { error } = await supabase
    .from("moneys")
    .update(updatedMoney)
    .eq("id", updatedMoney.id);
  if (error) return { error: error.message };

  const { error: logError } = await log("update", reason, money, {
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
          (Number(updatedMoney.amount) - Number(lastMoney.amount)),
      ),
    },
  });

  if (logError) return { logError };

  return { success: "edited!" };
}

export async function deleteMoney(
  money: Pick<money, "id" | "amount" | "name">,
  currentTotal: string,
) {
  const supabase = createClient();

  const { error: logError, success: logId } = await log(
    "delete",
    "delete",
    money.id,
    {
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
    },
  );
  if (logError) return { logError };

  const { error } = await supabase.from("moneys").delete().eq("id", money.id);
  if (error) {
    await supabase.from("logs").delete().eq("id", logId!);
    return { error: error.message };
  }

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
