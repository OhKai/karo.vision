import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResult, Result, ValueResult } from "./typescript-utils";

export const result = {
  ok: <T>(value?: T) => ({ ok: true, value }) as ValueResult<T>,
  error: <E>(error?: E) => ({ ok: false, error }) as ErrorResult<E>,
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const readLocalStorage = (key: string, initialValue: string) => {
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
};

export const writeLocalStorage = (key: string, value: string) => {
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
};
