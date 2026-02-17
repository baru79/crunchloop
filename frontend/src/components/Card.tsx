import type { ReactNode } from "react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils";

interface CardProps {
  header?: ReactNode;
  form?: ReactNode;
  content?: ReactNode;
  className?: string;
}

export const Card = ({ header, form, content, className = "" }: CardProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  return (
    <div
      className={cn(
        "flex flex-col h-full overflow-hidden rounded-lg border",
        {
          "bg-white border-gray-200 text-slate-800": !darkMode,
          "bg-slate-800 border-slate-700 text-slate-200": darkMode,
        },
        className,
      )}
    >
      {header && (
        <div
          className={cn("border-b", {
            "border-slate-200": !darkMode,
            "border-slate-700": darkMode,
          })}
        >
          {header}
        </div>
      )}
      {form && (
        <div
          className={cn("border-b", {
            "border-slate-200": !darkMode,
            "border-slate-700": darkMode,
          })}
        >
          {form}
        </div>
      )}
      {content && (
        <div className="flex-1 overflow-y-auto flex flex-col">{content}</div>
      )}
    </div>
  );
};
