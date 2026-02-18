import type { SVGProps } from "react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils";

export const CheckIcon = ({
  className,
  width = 24,
  height = 24,
  ...props
}: SVGProps<SVGSVGElement>) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className={cn(className)}
      {...props}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className={cn({
          "fill-black": !darkMode,
          "fill-white": darkMode,
        })}
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M7 13l3 3 7-9"
        className={cn({
          "stroke-white": !darkMode,
          "stroke-black": darkMode,
        })}
      />
    </svg>
  );
};
