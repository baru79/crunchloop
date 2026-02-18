import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../utils";

export const CheckEmptyIcon = ({
  className,
  width = 24,
  height = 24,
}: {
  className?: string;
  width?: number;
  height?: number;
}) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  return (
    <svg
      className={cn(
        "transition-colors",
        { "text-slate-600": !darkMode, "text-slate-300": darkMode },
        className,
      )}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};
