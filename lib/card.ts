export const ENCRYPTION_SALT = "encryption:salt";
export const ENCRYPTION_IV = "encryption:iv";

export function getBin(number: string) {
  return number.replace(/[^0-9]/g, "").slice(0, 6);
}
