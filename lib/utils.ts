import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PHPeso = new Intl.NumberFormat("en-US");

export const UsePhpPeso = (number: string | number) => {
  return PHPeso.format(Number(number));
};

export const UsePhpPesoWSign = (number: string | number, decimals?: number) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: decimals ?? 2,
  });

  return formatted.format(Number(number));
};

export const UseDefaultURL = () => {
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
