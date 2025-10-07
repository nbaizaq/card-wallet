import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorList: string[] = [
  "#E6E6EA",
  "#FE4A49",
  "#FED766",
  "#63C132",
  "#9DD1F1",
  "#FFFFFF",
  "#000000",
];