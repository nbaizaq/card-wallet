import { Models } from "appwrite";

export type Cards = Models.RowList<Models.DefaultRow>;
export type Card = Models.DefaultRow;
export type CardContent = {
  name: string;
  currency: string;
  holder: string;
  number: string;
  cvv: string;
  expire: string;
  pin: string;
}