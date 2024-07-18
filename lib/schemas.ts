import { z } from "zod";

export const Reason = z
  .string()
  .min(4, { message: "Please state your reason at least 4 characters" })
  .max(55, { message: "Max of 55 characters only" });

export const Amount = z.coerce
  .number({ message: "Number only" })
  .nonnegative({ message: "Must be positive" });

export const Name = z.string().min(1, { message: "Please input name" });

export const UUIDType = z.string().uuid();

export const AddMoneySchema = z.object({
  name: Name,
  amount: Amount,
});

export const EditMoneySchema = z.object({
  name: Name,
  amount: Amount,
  created_at: z.string(),
  color: z.string().nullable(),
  updated_at: z.string().nullable(),
  reason: Reason,
  add: Amount.optional(),
  ded: Amount.optional(),
});

export const TansferMoneySchema = z.object({
  transferAmount: Amount,
  transferTo: z.string().uuid({ message: "Please use the money's UUID" }),
  reason: Reason,
});

export const SignUpSchema = z
  .object({
    listname: z
      .string()
      .min(6, { message: "Listname must be at least 6 characters" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    cpassword: z.string().min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.cpassword, {
    path: ["cpassword"],
    message: "Password did not match",
  });

export const LogInSchema = z.object({
  listname: z.string().min(1, { message: "Please input listname" }),
  password: z.string().min(1, { message: "Please input password" }),
});
