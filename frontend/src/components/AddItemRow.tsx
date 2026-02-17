import { useState } from "react";
import { PlusIcon } from "./icons/PlusIcon";
import { Input } from "./Input";
import { cn } from "../utils";
import { useTheme } from "../hooks/useTheme";

interface AddItemRowProps {
  onSubmit: (data: { name: string; description: string }) => Promise<void>;
  isLoading?: boolean;
}

export const AddItemRow = ({ onSubmit, isLoading }: AddItemRowProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitItem = async () => {
    if (!name.trim() || loading || isLoading) return;
    try {
      setLoading(true);
      await onSubmit({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitItem();
  };

  const handleIconClick = async () => {
    await submitItem();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitItem();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("p-3 border-t", {
        "border-gray-200": !darkMode,
        "border-slate-700": darkMode,
      })}
    >
      <div className="mb-2">
        <Input
          value={name}
          onChange={setName}
          onKeyDown={handleKeyDown}
          placeholder="Add your task..."
          disabled={loading || isLoading}
          icon={<PlusIcon width={48} height={48} />}
          onIconClick={handleIconClick}
          iconTitle="Add task"
          inputClassName="py-2 text-sm"
        />
      </div>
      <div
        title={
          !name.trim()
            ? "To add a description first need to enter the task name"
            : undefined
        }
      >
        <Input
          value={description}
          onChange={setDescription}
          onKeyDown={handleKeyDown}
          placeholder="Description (optional)..."
          disabled={loading || isLoading || !name.trim()}
          inputClassName={cn(
            "pr-11 border rounded-full py-1.5 text-sm focus:ring-2 focus:ring-blue-500 transition-colors",
            {
              "border-slate-300 bg-white": !darkMode,
              "border-slate-600 bg-slate-800 text-slate-100": darkMode,
            },
          )}
        />
      </div>
    </form>
  );
};
