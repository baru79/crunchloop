import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { TodoList } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleResponseError = (message: string, response: Response) => {
  throw new Error(`${message}: ${response.status} ${response.statusText}`);
};

export const getLocalStorageLists = (): TodoList[] | null => {
  const storedData = localStorage.getItem("todo-lists");
  if (storedData) {
    return JSON.parse(storedData);
  }
  return null;
};

export const setLocalStorageLists = (lists: TodoList[]) => {
  localStorage.setItem("todo-lists", JSON.stringify(lists));
};
