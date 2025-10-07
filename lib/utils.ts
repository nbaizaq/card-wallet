import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorList: string[] = [
  "bg-gray-200",
  "bg-red-200",
  "bg-orange-200",
  "bg-green-200",
  "bg-sky-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-violet-200",
];