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

// export const Amount = z.coerce
//   .number({ message: "Amount must be numeric" })
//   .nonnegative({ message: "Amount must be positive" });

// export const Name = z.string().min(1, { message: "Please input money name" });

export const UUIDType = z
  .string()
  .uuid({ message: "Id is not in type of UUID" });

export const AddMoneySchema = z.object({
  name: z.string().min(1, { message: "Name can't be empty" }),
  amount: z.coerce
    .number({ message: "Amount must only be number" })
    .nonnegative({ message: "Amount must be positive number" }),
});

export const EditMoneySchema = z.object({
  id: UUIDType,
  name: z.string().min(1, { message: "Name can't be empty" }),
  amount: z.coerce
    .number({ message: "Amount must only be number" })
    .nonnegative({ message: "Amount must be positive number" }),
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
  reason: z
    .string()
    .min(4, { message: "Reason must be at least 4 characters" })
    .max(55, { message: "Reason must be at most 55 characters" })
    .optional(),
  add: z.coerce
    .number({ message: "Amount must only be number" })
    .nonnegative({ message: "Add money must be positive only" })
    .optional(),
  ded: z.coerce
    .number({ message: "Amount must only be number" })
    .nonnegative({ message: "Deducted money must be positive only" })
    .optional(),
});

export const EditMoneyType = z.object({
  id: UUIDType,
  name: z.string().min(1, { message: "Name can't be empty" }),
  amount: z
    .number({ message: "Amount must only be number" })
    .nonnegative({ message: "Amount must be positive only" }),
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
});

export const DeleteMoneyType = z.object({
  id: UUIDType,
  name: z.string(),
  amount: z.number(),
});

export const LogChangesTypes = z.object({
  from: z.object({
    name: z.string(),
    amount: z.number(),
    total: z.number(),
  }),
  to: z.object({
    name: z.string(),
    amount: z.number(),
    total: z.number(),
  }),
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

export const TansferMoneySchema = z.object({
  transferAmount: z.coerce
    .number({ message: "Transfer amount must only be number" })
    .nonnegative({ message: "Transfer amount must be positive number" }),
  transferTo: UUIDType,
  reason: z
    .string()
    .min(4, {
      message: "Reason for transferring must be at least 4 characters",
    })
    .max(55, {
      message: "Reason for transferring must be at most 55 characters",
    }),
  fee: z.coerce
    .number({ message: "Fee must only be number" })
    .nonnegative({ message: "Fee must not be negative" }),
});
export const TransferTypes = z.object({
  newMoneyData: EditMoneyType,
  oldMoneyData: EditMoneyType,
  currentTotal: z.number({ message: "Current total is not a number" }),
});

export interface ModifiedLogs extends Logs {
  total?: number;
  moneys?: Pick<Moneys, "name" | "color" | "id"> | null;
  money_name?: string;
}
