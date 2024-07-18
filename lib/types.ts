import { Database } from "@/database.types";

type Logs = Database["public"]["Tables"]["logs"]["Row"];
type Moneys = Database["public"]["Tables"]["moneys"]["Row"];

/* eslint-disable no-unused-vars */
export type LogChangesTypes = {
  from: { name: string; amount: number; total: number };
  to: { name: string; amount: number; total: number };
};

export type Progress = {
  expenses: { amount: number; reason: string; date: string }[];
  gains: { amount: number; reason: string; date: string }[];
  date: string;
  expensesSum: number;
  gainsSum: number;
  gainOrLoss: number;
  currentTotal: number;
};

export type MoneyTypes = Database["public"]["Tables"]["moneys"]["Row"];

export type TransferTypes = {
  newMoneyData: Omit<MoneyTypes, "list">;
  oldMoneyData: Omit<MoneyTypes, "list">;
  currentTotal: number;
};
export interface ModifiedLogs extends Logs {
  total?: number;
  moneys?: Pick<Moneys, "name" | "color" | "id"> | null;
  money_name?: string;
}
