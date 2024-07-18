"use server";
import { createClient } from "@/lib/supabase/server";
import { log } from "./logs";
import { z } from "zod";
import { AddMoneySchema, Reason, UUIDType } from "@/lib/schemas";

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

export async function getMoney(id: z.infer<typeof UUIDType>) {
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
  money: z.infer<typeof AddMoneySchema>,
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
      amount: 0,
      name: "",
      total: currentTotal,
    },
    to: {
      amount: money.amount,
      name: money.name,
      total: Number(currentTotal) + Number(money.amount),
    },
  });

  if (logError) return { logError };

  return { success: "added!" };
}
export async function transferMoney(
  from: TransferTypes,
  to: TransferTypes,
  reason: z.infer<typeof Reason>,
) {
  const { error: fromError, logError: fromLogError } = await editMoney(
    from.oldMoneyData,
    from.newMoneyData,
    from.currentTotal,
    reason,
    "transfer",
  );
  if (fromError) return { error: fromError };
  if (fromLogError) return { error: fromLogError };
  const { error: toError, logError: toLogError } = await editMoney(
    to.oldMoneyData,
    to.newMoneyData,
    to.currentTotal,
    reason,
    "transfer",
  );
  if (toError) return { error: toError };
  if (toLogError) return { error: fromLogError };
  return { success: "transfered!" };
}
export async function editMoney(
  oldMoneyData: Omit<MoneyTypes, "list">,
  newMoneyData: Omit<MoneyTypes, "list">,
  currentTotal: number,
  reason: z.infer<typeof Reason>,
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
    .update(newMoneyData)
    .eq("id", oldMoneyData.id);
  if (error) return { error: error.message };

  const { error: logError } = await log(type, reason, oldMoneyData.id, {
    from: {
      amount: newMoneyData.amount,
      name: newMoneyData.name,
      total: currentTotal,
    },
    to: {
      amount: oldMoneyData.amount,
      name: oldMoneyData.name,
      total:
        type === "transfer"
          ? currentTotal
          : Number(currentTotal) +
            (Number(oldMoneyData.amount) - Number(newMoneyData.amount)),
    },
  });

  if (logError) return { logError };

  return { success: "edited!" };
}

export async function deleteMoney(
  money: Pick<MoneyTypes, "id" | "amount" | "name">,
  currentTotal: number,
) {
  const supabase = createClient();

  const { error: logError, success: logId } = await log(
    "delete",
    "delete",
    money.id,
    {
      from: {
        amount: money.amount,
        name: money.name,
        total: currentTotal,
      },
      to: {
        amount: 0,
        name: "",
        total: Number(currentTotal) - Number(money.amount),
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

export async function setColor(
  moneyId: z.infer<typeof UUIDType>,
  color: string,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("moneys")
    .update({ color })
    .eq("id", moneyId);

  if (error) return { error: error.message };
  return { success: "colored!" };
}
