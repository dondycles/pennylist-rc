/* eslint-disable no-unused-vars */
declare type LogChangesTypes = {
  from: { name: string; amount: string; total: string };
  to: { name: string; amount: string; total: string };
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
