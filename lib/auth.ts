import { getItem, setItem } from "./storage";
export const AUTH_KEY = "auth:is-logged-in";
export const AUTH_DATA_KEY = "auth:data";

export function isAuthenticated() {
  return getItem(AUTH_KEY) === "true";
}

export function setAuthenticated(value: boolean) {
  setItem(AUTH_KEY, value.toString());
}

export function setAuthData(data: unknown) {
  setItem(AUTH_DATA_KEY, JSON.stringify(data));
}

export function getAuthData() {
  return JSON.parse(getItem(AUTH_DATA_KEY) || "{}");
}
