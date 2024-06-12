import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PHPeso = new Intl.NumberFormat("en-US");

export const UsePhpPeso = (number: string | number) => {
  return PHPeso.format(Number(number));
};

const formatted = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PHP",
});

export const UsePhpPesoWSign = (number: string | number) => {
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

export const toMonthWord = (month: number): string => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (month >= 0 && month < 12) {
    return monthNames[month];
  } else {
    throw new Error("Invalid month number");
  }
};
