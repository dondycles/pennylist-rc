import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const UseDefaultURL = (): string => {
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  return defaultUrl;
};

export const AsteriskNumber = (number: number) => {
  const numberString = number.toString();
  const asteriskString = "*".repeat(numberString.length);

  return asteriskString;
};

export const toMonthWord = (date: string): string => {
  const month = new Date(date).getMonth();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[month];
};

export const UseAmountFormat = (
  amount: number,
  settings: { hide: boolean; decimals?: number; sign: boolean },
): string => {
  const withSign = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: settings?.decimals ?? 2,
  });

  const withoutSign = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: settings?.decimals ?? 2,
  });

  const numberString = amount.toString();
  const asteriskString = "*".repeat(numberString.length);

  return settings?.hide
    ? asteriskString
    : settings?.sign
      ? withSign.format(amount)
      : withoutSign.format(amount);
};
