import { createContext } from "react";
import type { Theme } from "../types";

export const ThemeContext = createContext<
  { theme: Theme; toggleTheme: () => void } | undefined
>(undefined);
