import { useState } from "react";
import { PlusIcon } from "./icons/PlusIcon";
import { Input } from "./Input";
import { Card } from "./Card";
import type { TodoList } from "../types";
import { cn } from "../utils";
import { useTheme } from "../hooks/useTheme";

interface CreateListFormProps {
  lists: TodoList[];
  onSubmit: (name: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateListForm = ({
  lists,
  onSubmit,
  isLoading,
}: CreateListFormProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onSubmit(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const handleIconClick = async () => {
    if (!name.trim() || loading || isLoading) return;
    try {
      setLoading(true);
      await onSubmit(name.trim());
      setName("");
    } finally {
      setLoading(false);
    }
  };

  const header = (
    <div className="p-4">
      <h2
        className={cn("text-xl font-bold", {
          "text-slate-800": !darkMode,
          "text-slate-100": darkMode,
        })}
      >
        To-Do List
      </h2>
    </div>
  );

  const form = (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <Input
        value={name}
        onChange={setName}
        placeholder="New list name..."
        disabled={loading || isLoading}
        icon={<PlusIcon width={48} height={48} />}
        onIconClick={handleIconClick}
        iconTitle="Create list"
        className="flex-1"
        inputClassName={cn("pr-11 rounded-full py-1.5 text-sm", {
          "border-slate-200": !darkMode,
          "border-slate-700 bg-slate-800 text-white": darkMode,
        })}
      />
    </form>
  );

  const content = !isLoading && lists.length === 0 && (
    <div className="p-12 text-center">
      <p
        className={cn({
          "text-slate-500": !darkMode,
          "text-slate-400": darkMode,
        })}
      >
        No lists have been entered yet
      </p>
      <p
        className={cn("text-sm", {
          "text-slate-400": !darkMode,
          "text-slate-500": darkMode,
        })}
      >
        Create your first list to get started
      </p>
    </div>
  );

  return <Card header={header} form={form} content={content} />;
};
