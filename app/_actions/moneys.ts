"use server";
import { createClient } from "@/lib/supabase/server";
import { log } from "./logs";
import { z } from "zod";
import {
  TransferTypes,
  AddMoneySchema,
  Reason,
  UUIDType,
  EditMoneyType,
  Amount,
  DeleteMoneyType,
} from "@/lib/types";

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
  const idParse = UUIDType.safeParse(id);
  if (!idParse.success) {
    return {
      error: idParse.error.issues[0].message,
    };
  }
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
  if (money.error) return { error: money.error.message };
  return { data: money.data };
}

export async function addMoney(
  money: z.infer<typeof AddMoneySchema>,
  currentTotal: z.infer<typeof Amount>,
) {
  const moneyParse = AddMoneySchema.safeParse(money);
  const totalParse = Amount.safeParse(currentTotal);
  if (!moneyParse.success) {
    return {
      error: moneyParse.error.issues[0].message,
    };
  }
  if (!totalParse.success) {
    return {
      error: totalParse.error.issues[0].message,
    };
  }
  const supabase = createClient();

  const { error, data } = await supabase
    .from("moneys")
    .insert(money)
    .select("id")
    .single();
  if (error) return { error: error.message };

  const { error: logError } = await log("add", "new added money", data.id, {
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

  if (logError) return { error: logError };

  return { success: "added!" };
}
export async function transferMoney(
  from: z.infer<typeof TransferTypes>,
  to: z.infer<typeof TransferTypes>,
  reason: z.infer<typeof Reason>,
) {
  const fromParse = TransferTypes.safeParse(from);
  const toParse = TransferTypes.safeParse(to);
  const reasonParse = Reason.safeParse(reason);

  if (!fromParse.success) {
    return {
      error: fromParse.error.issues[0].message,
    };
  }
  if (!toParse.success) {
    return {
      error: toParse.error.issues[0].message,
    };
  }
  if (!reasonParse.success) {
    return {
      error: reasonParse.error.issues[0].message,
    };
  }

  const { error: fromError } = await editMoney(
    from.oldMoneyData,
    from.newMoneyData,
    from.currentTotal,
    reason,
    "transfer",
  );
  if (fromError) return { error: fromError };
  const { error: toError } = await editMoney(
    to.oldMoneyData,
    to.newMoneyData,
    to.currentTotal,
    reason,
    "transfer",
  );
  if (toError) return { error: toError };
  return { success: "transfered!" };
}
export async function editMoney(
  oldMoneyData: z.infer<typeof EditMoneyType>,
  newMoneyData: z.infer<typeof EditMoneyType>,
  currentTotal: number,
  reason: z.infer<typeof Reason>,
  type: string,
) {
  const oldMoneyDataParse = EditMoneyType.safeParse(oldMoneyData);
  const newMoneyDataParse = EditMoneyType.safeParse(newMoneyData);
  const reasonParse = Reason.safeParse(reason);

  if (!oldMoneyDataParse.success) {
    return {
      error: oldMoneyDataParse.error.issues[0].message,
    };
  }
  if (!newMoneyDataParse.success) {
    return { error: newMoneyDataParse.error.issues[0].message };
  }
  if (!reasonParse.success) {
    return { error: reasonParse.error.issues[0].message };
  }

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
      amount: oldMoneyData.amount,
      name: oldMoneyData.name,
      total: currentTotal,
    },
    to: {
      amount: newMoneyData.amount,
      name: newMoneyData.name,
      total:
        type === "transfer"
          ? currentTotal
          : Number(currentTotal) +
            (Number(newMoneyData.amount) - Number(oldMoneyData.amount)),
    },
  });

  if (logError) return { error: logError };

  return { success: "edited!" };
}

export async function deleteMoney(
  money: z.infer<typeof DeleteMoneyType>,
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
  if (logError) return { error: logError };

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
  const moneyIdParse = UUIDType.safeParse(moneyId);

  if (!moneyIdParse.success) {
    return {
      error: moneyIdParse.error.issues[0].message,
    };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("moneys")
    .update({ color })
    .eq("id", moneyId);

  if (error) return { error: error.message };
  return { success: "colored!" };
}
