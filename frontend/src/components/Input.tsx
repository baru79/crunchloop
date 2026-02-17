import type { ReactNode } from "react";
import { cn } from "../utils";
import { useTheme } from "../hooks/useTheme";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
  iconTitle?: string;
  disabled?: boolean;
  type?: string;
  className?: string;
  inputClassName?: string;
  iconClassName?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = ({
  value,
  onChange,
  placeholder,
  icon,
  onIconClick,
  iconTitle,
  disabled,
  type = "text",
  className = "",
  inputClassName = "",
  iconClassName = "",
  onKeyDown,
}: InputProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className={cn("relative", className)}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-1.5 pr-11 border rounded-full transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
          {
            "bg-white border-slate-300 text-slate-900 placeholder-slate-400":
              !darkMode,
            "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500":
              darkMode,
            "disabled:bg-slate-50 disabled:text-slate-400": !darkMode,
            "disabled:bg-slate-900 disabled:text-slate-400": darkMode,
          },
          inputClassName,
        )}
      />
      {icon && (
        <button
          type="button"
          onClick={onIconClick}
          disabled={disabled}
          title={iconTitle}
          className={cn(
            "absolute -right-0.5 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center",
            "rounded-full transition-colors disabled:opacity-40",
            {
              "text-slate-400 hover:cursor-pointer hover:text-slate-600":
                !darkMode,
              "text-slate-400 hover:cursor-pointer hover:text-slate-200":
                darkMode,
            },
            iconClassName,
          )}
        >
          {icon}
        </button>
      )}
    </div>
  );
};
