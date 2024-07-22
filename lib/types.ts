import { Database } from "@/database.types";
import { z } from "zod";

const Listname = z
  .string()
  .min(6, { message: "Listname must be at least 6 characters" });
const Password = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" });

export const SignUpSchema = z
  .object({
    listname: Listname,
    password: Password,
    cpassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Password did not match",
  });

export const LogInSchema = z.object({
  listname: Listname,
  password: Password,
});

type Logs = Database["public"]["Tables"]["logs"]["Row"];
export type Moneys = Database["public"]["Tables"]["moneys"]["Row"];

export const Reason = z
  .string()
  .min(4, { message: "Please state your reason at least 4 characters" })
  .max(55, { message: "Reason must be at max of 55 characters only" });

export const Amount = z.coerce
  .number({ message: "Amount must be numeric" })
  .nonnegative({ message: "Amount must be positive" });

export const Name = z.string();

export const UUIDType = z.string().uuid({ message: "UUID only" });

export const AddMoneySchema = z.object({
  name: Name.min(1, { message: "Please input money name" }),
  amount: Amount,
});

export const EditMoneySchema = z.object({
  id: UUIDType,
  name: Name.min(1, { message: "Please input money name" }),
  amount: Amount,
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
  reason: Reason,
  add: Amount.optional(),
  ded: Amount.optional(),
});

export const EditMoneyType = z.object({
  id: UUIDType,
  name: Name.min(1, { message: "Please input money name" }),
  amount: Amount,
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const DeleteMoneyType = z.object({
  id: UUIDType,
  name: Name,
  amount: Amount,
});

export const LogChangesTypes = z.object({
  from: z.object({ name: Name, amount: Amount, total: Amount }),
  to: z.object({ name: Name, amount: Amount, total: Amount }),
});

export type Progress = {
  expenses: { amount: number; reason: string; date: string }[];
  gains: { amount: number; reason: string; date: string }[];
  date: string;
  expensesSum: number;
  gainsSum: number;
  gainOrLoss: number;
  currentTotal: number;
};

export const TransferTypes = z.object({
  newMoneyData: EditMoneyType,
  oldMoneyData: EditMoneyType,
  currentTotal: Amount,
});

export const TansferMoneySchema = z.object({
  transferAmount: Amount,
  transferTo: UUIDType,
  reason: Reason,
});

export interface ModifiedLogs extends Logs {
  total?: number;
  moneys?: Pick<Moneys, "name" | "color" | "id"> | null;
  money_name?: string;
}

export const useParser = () => {};
