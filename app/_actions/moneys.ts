"use server";
import { createClient } from "@/lib/supabase/server";
import { log } from "./logs";

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
  money: Pick<MoneyTypes, "amount" | "name">,
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
export async function transferMoney(from: TransferTypes, to: TransferTypes) {
  const { error: fromError, logError: fromLogError } = await editMoney(
    from.updatedMoneyData,
    from.oldMoneyData,
    from.currentTotal,
    "transfer",
    "transfer",
  );
  if (fromError) return { error: fromError };
  if (fromLogError) return { error: fromLogError };
  const { error: toError, logError: toLogError } = await editMoney(
    to.updatedMoneyData,
    to.oldMoneyData,
    to.currentTotal,
    "transfer",
    "transfer",
  );
  if (toError) return { error: toError };
  if (toLogError) return { error: fromLogError };
  return { success: "transfered!" };
}
export async function editMoney(
  oldMoneyData: Omit<MoneyTypes, "list">,
  newMoneyData: Omit<MoneyTypes, "list">,
  currentTotal: string,
  reason: string,
  type: string,
) {
  if (
    type !== "transfer" &&
    oldMoneyData.amount === newMoneyData.amount &&
    oldMoneyData.name === newMoneyData.name
  )
    return { error: "No changes made!" };

  if (oldMoneyData.id !== newMoneyData.id)
    return { error: "Ids did not match!" };

  const supabase = createClient();

  const { error } = await supabase
    .from("moneys")
    .update(oldMoneyData)
    .eq("id", oldMoneyData.id);
  if (error) return { error: error.message };

  const { error: logError } = await log(type, reason, oldMoneyData.id, {
    from: {
      amount: String(newMoneyData.amount),
      name: newMoneyData.name,
      total: String(currentTotal),
    },
    to: {
      amount: String(oldMoneyData.amount),
      name: oldMoneyData.name,
      total:
        type === "transfer"
          ? currentTotal
          : String(
              Number(currentTotal) +
                (Number(oldMoneyData.amount) - Number(newMoneyData.amount)),
            ),
    },
  });

  if (logError) return { logError };

  return { success: "edited!" };
}

export async function deleteMoney(
  money: Pick<MoneyTypes, "id" | "amount" | "name">,
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

export async function setColor(money: Pick<MoneyTypes, "id">, color: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("moneys")
    .update({ color })
    .eq("id", money.id);

  if (error) return { error: error.message };
  return { success: "colored!" };
}
