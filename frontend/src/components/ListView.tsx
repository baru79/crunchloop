import { useState } from "react";
import type { TodoList, UpdateTodoItemDTO } from "../types";
import { ItemRow } from "./ItemRow";
import { AddItemRow } from "./AddItemRow";
import { CloseIcon } from "./icons/CloseIcon";
import { FilterIcon } from "./icons/FilterIcon";
import { Card } from "./Card";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult, DragUpdate } from "@hello-pangea/dnd";
import { cn } from "../utils";
import { useTheme } from "../hooks/useTheme";

interface ListViewProps {
  list: TodoList;
  onUpdateList: (name: string) => Promise<void>;
  onAddItem: (name: string, description: string) => Promise<void>;
  onUpdateItem: (itemId: number, data: UpdateTodoItemDTO) => Promise<void>;
  onUpdateItemPositions: (newPositions: number[]) => Promise<void>;
  onDeleteItem: (itemId: number) => Promise<void>;
  onDeleteList: () => Promise<void>;
  isLoading?: boolean;
}

export const ListView = ({
  list,
  onUpdateList,
  onAddItem,
  onUpdateItem,
  onUpdateItemPositions,
  onDeleteItem,
  onDeleteList,
  isLoading,
}: ListViewProps) => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const [isEditingName, setIsEditingName] = useState(false);
  const [listName, setListName] = useState(list.name);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "done" | "pending">("all");
  const [showFilter, setShowFilter] = useState(false);

  const filteredItems = list.todoItems.filter((item) => {
    if (filter === "done") return item.done;
    if (filter === "pending") return !item.done;
    return true;
  });

  const handleDeleteList = async () => {
    if (confirm(`Are you sure you want to delete the list "${list.name}"?`)) {
      await onDeleteList();
    }
  };

  const handleToggleDone = async (itemId: number, done: boolean) => {
    await onUpdateItem(itemId, { done });
  };

  const handleUpdateItem = async (
    itemId: number,
    name: string,
    description: string,
  ) => {
    await onUpdateItem(itemId, { name, description });
  };

  const updateListName = (save: boolean) => {
    if (!save || !listName.trim()) {
      setListName(list.name);
      setIsEditingName(false);
      return;
    }
    const saveName = async () => {
      try {
        setLoading(true);
        await onUpdateList(listName.trim());
        setIsEditingName(false);
      } finally {
        setLoading(false);
      }
    };
    saveName();
  };

  const handleSaveName = () => {
    updateListName(true);
  };

  const handleCancelEdit = () => {
    updateListName(false);
  };

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  const onDragUpdate = (update: DragUpdate) => {
    const { destination } = update;
    if (!destination) {
      document.body.style.cursor = "not-allowed";
    } else {
      document.body.style.cursor = "";
    }
  };

  const onDragEnd = async (result: DropResult) => {
    document.body.style.cursor = "";
    const { destination, source } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const reorderedItems = Array.from(list.todoItems);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);
    onUpdateItemPositions(reorderedItems.map((i) => i.id));
  };

  const header = (
    <div className={cn("flex items-center justify-between p-4 group")}>
      {isEditingName ? (
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSaveName}
          disabled={loading || isLoading}
          autoFocus
          className={cn(
            "flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold bg-transparent text-inherit",
          )}
        />
      ) : (
        <>
          <h2
            onClick={() => setIsEditingName(true)}
            className={cn(
              "text-lg font-bold flex-1 cursor-text transition-colors",
            )}
          >
            {list.name}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-sm font-medium cursor-default",
                {
                  "bg-white border-gray-200 text-slate-800": !darkMode,
                  "bg-slate-800 border-slate-700 text-slate-200": darkMode,
                },
              )}
            >
              {`Tasks: ${list.todoItems.length}`}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowFilter(!showFilter)}
                className={cn("p-1 rounded transition-colors", {
                  "hover:bg-slate-100 hover:text-slate-800": !darkMode,
                  "hover:bg-slate-800 hover:text-slate-200": darkMode,
                })}
                title="Filter tasks"
              >
                <FilterIcon className={cn("w-5 h-5")} />
              </button>
              {showFilter && (
                <div
                  className={cn(
                    "absolute right-0 mt-1 rounded-lg shadow-lg border py-1 z-10 min-w-30",
                    {
                      "bg-white border-slate-200": !darkMode,
                      "bg-slate-800 border-slate-700": darkMode,
                    },
                  )}
                >
                  <button
                    onClick={() => {
                      setFilter("all");
                      setShowFilter(false);
                    }}
                    className={cn("w-full px-3 py-2 text-left text-sm", {
                      "hover:bg-slate-100": !darkMode,
                      "hover:bg-slate-700": darkMode,
                      "text-blue-600 font-bold": !darkMode && filter === "all",
                      "text-blue-400 font-bold": darkMode && filter === "all",
                      "text-slate-700": !darkMode && filter !== "all",
                      "text-slate-200": darkMode && filter !== "all",
                    })}
                  >
                    All ({list.todoItems.length})
                  </button>
                  <button
                    onClick={() => {
                      setFilter("pending");
                      setShowFilter(false);
                    }}
                    className={cn("w-full px-3 py-1 text-left text-sm", {
                      "hover:bg-slate-100": !darkMode,
                      "hover:bg-slate-700": darkMode,
                      "bg-blue-50 text-blue-600":
                        !darkMode && filter === "pending",
                      "bg-blue-900/30 text-blue-400":
                        darkMode && filter === "pending",
                      "text-slate-700": !darkMode && filter !== "pending",
                      "text-slate-200": darkMode && filter !== "pending",
                    })}
                  >
                    Pending ({list.todoItems.filter((i) => !i.done).length})
                  </button>
                  <button
                    onClick={() => {
                      setFilter("done");
                      setShowFilter(false);
                    }}
                    className={cn("w-full px-3 py-1 text-left text-sm", {
                      "hover:bg-slate-100": !darkMode,
                      "hover:bg-slate-700": darkMode,
                      "bg-blue-50 text-blue-600":
                        !darkMode && filter === "done",
                      "bg-blue-900/30 text-blue-400":
                        darkMode && filter === "done",
                      "text-slate-700": !darkMode && filter !== "done",
                      "text-slate-200": darkMode && filter !== "done",
                    })}
                  >
                    Done ({list.todoItems.filter((i) => i.done).length})
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleDeleteList}
              disabled={isLoading}
              className={cn(
                "p-1 relative -right-3.5 -top-3.5 rounded transition-colors",
                {
                  "hover:bg-slate-100": !darkMode,
                  "hover:bg-slate-700": darkMode,
                },
              )}
              title="Delete list"
            >
              <CloseIcon
                className={cn("w-5 h-5 text-slate-400", {
                  "hover:text-red-500": !darkMode,
                  "hover:text-red-400": darkMode,
                })}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );

  const form = (
    <AddItemRow
      onSubmit={({ name, description }) => onAddItem(name, description)}
      isLoading={isLoading}
    />
  );

  const content = (
    <>
      {/* Items List */}
      <div className="flex-1 overflow-y-auto">
        {list.todoItems.length === 0 ? (
          <div
            className={cn("p-8 text-center", {
              "text-slate-500": !darkMode,
              "text-slate-400": darkMode,
            })}
          >
            <p className="text-lg">No tasks have been entered yet.</p>
            <p className="text-sm">Add your first task!</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className={cn("p-8 text-center", {
              "text-slate-500": !darkMode,
              "text-slate-400": darkMode,
            })}
          >
            <p>
              There are no tasks{" "}
              {filter === "done"
                ? "done"
                : filter === "pending"
                  ? "pending"
                  : ""}
            </p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
            <Droppable droppableId="todoItems">
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {filteredItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id.toString()}
                      index={index}
                      isDragDisabled={filter !== "all"}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ItemRow
                            item={item}
                            onToggleDone={handleToggleDone}
                            onUpdate={handleUpdateItem}
                            onDelete={onDeleteItem}
                            isLoading={isLoading}
                          />
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </>
  );

  return <Card header={header} form={form} content={content} />;
};
