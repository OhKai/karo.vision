import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ErrorResult, Result, ValueResult } from "./typescript-utils";
import { PORT } from "@/config";

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

/**
 * Takes a `bytes` argument and returns its representation in an human-readable rounded string
 * format.
 */
export function convertBytesToRoundedString(bytes: number) {
  if (bytes > 1000 * 1000 * 1000) {
    return `${(bytes / (1000 * 1000 * 1000)).toFixed(1)} GB`;
  } else if (bytes > 1000 * 1000) {
    return `${(bytes / (1000 * 1000)).toFixed(0)} MB`;
  } else if (bytes > 1000) {
    return `${(bytes / 1000).toFixed(0)} KB`;
  } else {
    return `${bytes} Bytes`;
  }
}

/**
 * Takes a `seconds` argument and returns its representation in an human-readable rounded string
 * format.
 */
export function convertSecondsToRoundedString(seconds: number) {
  if (seconds < 0) {
    return "--:--:--";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 99) {
    return "99+ hr";
  }

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}

export const convertTimeStringToSeconds = (time: string) => {
  const [hours, minutes, seconds] = time
    .split(":")
    .map((part) => parseInt(part));
  return (hours * 60 + minutes) * 60 + (seconds || 0);
};

export function roundFPS(fps: string) {
  if (fps.includes("/")) {
    const numerator = parseInt(fps);
    const denominator = parseInt(fps.substring(fps.indexOf("/") + 1));
    return "" + Math.round(numerator / denominator);
  } else {
    return fps;
  }
}

export const fileURL = (fileId: number, download = false, token?: string) => {
  const queryParams = new URLSearchParams({
    ...(download ? { download: "1" } : {}),
    ...(token ? { token } : {}),
  });
  return `${process.env.NODE_ENV === "development" ? `http://${location.hostname}:${PORT}` : ""}/files/${fileId}${queryParams.toString()}`;
};

export const fileThumbURL = (fileId: number, token?: string) => {
  const queryParams = new URLSearchParams({
    ...(token ? { token } : {}),
  });
  return `${process.env.NODE_ENV === "development" ? `http://${location.hostname}:${PORT}` : ""}/files/${fileId}/thumb${queryParams.toString()}`;
};
