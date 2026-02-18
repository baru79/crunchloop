import type { SVGProps } from "react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils";

export const PlusIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  return (
    <svg
      className={cn(
        {
          "text-slate-950": !darkMode,
          "text-white": darkMode,
        },
        className,
      )}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path
        d="M12 7v10M7 12h10"
        className={cn({
          "stroke-white": !darkMode,
          "stroke-slate-950": darkMode,
        })}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
