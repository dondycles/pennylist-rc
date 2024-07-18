/* eslint-disable no-unused-vars */
declare type LogChangesTypes = {
  from: { name: string; amount: number; total: number };
  to: { name: string; amount: number; total: number };
};

declare type Progress = {
  expenses: { amount: number; reason: string; date: string }[];
  gains: { amount: number; reason: string; date: string }[];
  date: string;
  expensesSum: number;
  gainsSum: number;
  gainOrLoss: number;
  currentTotal: number;
};

declare type MoneyTypes = Database["public"]["Tables"]["moneys"]["Row"];
declare type TransferTypes = {
  newMoneyData: Omit<MoneyTypes, "list">;
  oldMoneyData: Omit<MoneyTypes, "list">;
  currentTotal: number;
};
