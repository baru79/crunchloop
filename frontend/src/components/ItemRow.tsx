import { useState } from "react";
import type { TodoItem } from "../types";
import { CheckIcon } from "./icons/CheckIcon";
import { CheckEmptyIcon } from "./icons/CheckEmptyIcon";
import { CloseIcon } from "./icons/CloseIcon";
import { EditIcon } from "./icons/EditIcon";
import { DragHandleIcon } from "./icons/DragHandleIcon";
import { cn } from "../utils";
import { useTheme } from "../hooks/useTheme";

interface ItemRowProps {
  item: TodoItem;
  onToggleDone: (itemId: number, done: boolean) => Promise<void>;
  onUpdate: (
    itemId: number,
    name: string,
    description: string,
  ) => Promise<void>;
  onDelete: (itemId: number) => Promise<void>;
  isLoading?: boolean;
}

export const ItemRow = ({
  item,
  onToggleDone,
  onUpdate,
  onDelete,
  isLoading,
}: ItemRowProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description || "");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the item "${item.name}"?`)) {
      await onDelete(item.id);
    }
  };

  const handleSaveEdit = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      await onUpdate(item.id, name.trim(), description.trim());
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(item.name);
    setDescription(item.description || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className={cn("flex flex-col gap-2 p-3 border-b", {
          "border-gray-200 bg-blue-50/50": !darkMode,
          "border-slate-700 bg-slate-800/80": darkMode,
        })}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => onToggleDone(item.id, !item.done)}
            disabled={loading || isLoading}
            className={cn("mt-2 p-0")}
          >
            {item.done ? (
              <CheckIcon
                width={20}
                height={20}
                className={cn({
                  "text-slate-400": !darkMode,
                  "text-white": darkMode,
                })}
              />
            ) : (
              <CheckEmptyIcon
                width={20}
                height={20}
                className={cn({
                  "text-slate-400": !darkMode,
                  "text-slate-500": darkMode,
                })}
              />
            )}
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || isLoading}
              className={cn(
                "w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2",
                {
                  "border-gray-300": !darkMode,
                  "border-slate-600 bg-slate-700 text-white": darkMode,
                },
              )}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading || isLoading}
              rows={2}
              className={cn(
                "w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none",
                {
                  "border-gray-300": !darkMode,
                  "border-slate-600 bg-slate-700 text-white": darkMode,
                },
              )}
              placeholder="Description (optional)"
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleCancel}
            disabled={loading || isLoading}
            className={cn("px-3 py-1 text-sm border rounded", {
              "border-gray-300 text-gray-700 hover:bg-gray-100 disabled:bg-gray-100":
                !darkMode,
              "border-slate-600 text-slate-300 hover:bg-slate-700 disabled:bg-slate-800":
                darkMode,
            })}
          >
            Cancel
          </button>
          <button
            onClick={handleSaveEdit}
            disabled={loading || isLoading || !name.trim()}
            className={cn(
              "px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400",
            )}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 border-b group cursor-pointer",
        {
          "border-gray-200 hover:bg-gray-50": !darkMode,
          "border-slate-700 hover:bg-slate-700": darkMode,
        },
      )}
      title="Drag and drop to reorder"
    >
      {/* Drag Handle - visible on hover */}
      <div
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
          {
            "text-gray-400": !darkMode,
            "text-slate-400": darkMode,
          },
        )}
      >
        <DragHandleIcon className="w-5 h-5" />
      </div>
      <button
        onClick={() => onToggleDone(item.id, !item.done)}
        disabled={isLoading}
        className={cn("mt-1 p-0")}
        title={item.done ? "Mark as pending" : "Mark as done"}
      >
        {item.done ? (
          <CheckIcon
            width={20}
            height={20}
            className={cn({
              "text-slate-400": !darkMode,
              "text-white": darkMode,
            })}
          />
        ) : (
          <CheckEmptyIcon
            width={20}
            height={20}
            className={cn({
              "text-slate-400": !darkMode,
              "text-slate-500": darkMode,
            })}
          />
        )}
      </button>
      <div className="flex-1">
        <p
          className={cn("font-medium", {
            "line-through text-gray-400": item.done,
            "text-slate-900": !item.done && !darkMode,
            "text-slate-100": !item.done && darkMode,
          })}
        >
          {item.name}
        </p>
        {item.description && (
          <p
            className={cn("text-sm", {
              "text-gray-300": item.done,
              "text-gray-600": !item.done && !darkMode,
              "text-slate-400": !item.done && darkMode,
            })}
          >
            {item.description}
          </p>
        )}
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          disabled={isLoading}
          className={cn("disabled:text-gray-300 p-1", {
            "text-blue-500 hover:text-blue-700": !darkMode,
            "text-blue-400 hover:text-blue-300": darkMode,
          })}
          title="Edit task"
        >
          <EditIcon className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={handleDelete}
        disabled={isLoading}
        className={cn("disabled:text-gray-300 p-1", {
          "text-gray-500 hover:text-red-500": !darkMode,
          "text-slate-400 hover:text-red-400": darkMode,
        })}
        title="Delete task"
      >
        <CloseIcon width={20} height={20} />
      </button>
    </div>
  );
};
