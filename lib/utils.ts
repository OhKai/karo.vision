import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readLocalStorage(key: string, initialValue: string) {
  if (typeof window === "undefined") {
    return initialValue;
  }

  try {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue !== null) {
      return localStorageValue;
    } else {
      initialValue && localStorage.setItem(key, initialValue);
      return initialValue;
    }
  } catch {
    // If user is in private mode or has storage restriction
    // localStorage can throw.
    return initialValue;
  }
}

export function writeLocalStorage(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch {
    // If user is in private mode or has storage restriction
    // localStorage can throw.
    return;
  }
}
