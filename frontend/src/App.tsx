import { CreateListForm } from "./components/CreateListForm";
import { ListView } from "./components/ListView";
import { SpinnerIcon } from "./components/icons/SpinnerIcon";
import { LightIcon } from "./components/icons/LightIcon";
import { DarkIcon } from "./components/icons/DarkIcon";
import { useTodoLists } from "./hooks/useTodoLists";
import { cn } from "./utils";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
import { toast } from "sonner";

function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    lists,
    loading,
    error,
    createList,
    deleteList,
    updateList,
    addItem,
    updateItem,
    updateItemPositions,
    deleteItem,
    clearError,
  } = useTodoLists();

  const darkMode = theme === "dark";

  useEffect(() => {
    // Error Message show in toast
    if (error) {
      toast.error(error, {
        onDismiss: () => clearError(),
        onAutoClose: () => clearError(),
      });
    }
  }, [error, clearError]);

  return (
    <div
      className={cn("min-h-screen p-4 relative", {
        "dark bg-slate-950": darkMode,
        "bg-gray-100": !darkMode,
      })}
    >
      <div className="max-w-6xl mx-auto relative">
        <header
          className={cn(
            "flex items-center justify-between p-4 mb-6 rounded-lg border",
            {
              "bg-slate-800 text-slate-200 border-slate-900": !darkMode,
              "bg-white text-slate-800 border-gray-200": darkMode,
            },
          )}
        >
          <h1 className="text-xl font-bold">To-Do List</h1>
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2 rounded-full transition-colors border hover:cursor-pointer",
              {
                "bg-gray-500 border-gray-700 text-white hover:bg-gray-400":
                  !darkMode,
                "border-gray-300 text-gray-800 hover:bg-gray-200": darkMode,
              },
            )}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <LightIcon className="w-6 h-6" />
            ) : (
              <DarkIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </header>

        {/* Create List Form */}
        <div
          className={cn("w-full border-b mb-6", {
            "border-gray-200": darkMode,
            "border-slate-700": !darkMode,
          })}
        >
          <div className="grid grid-cols-1 max-w-90 m-auto">
            <CreateListForm
              onSubmit={(name) => createList({ name })}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Empty state */}
        {!loading && lists.length === 0 && (
          <div className="p-12 text-center">
            <p
              className={cn({
                "text-slate-500": !darkMode,
                "text-slate-400": darkMode,
              })}
            >
              No lists have been entered yet.
            </p>
            <p
              className={cn("text-sm p-4", {
                "text-slate-400": !darkMode,
                "text-slate-500": darkMode,
              })}
            >
              Create your first list to get started.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && lists.length === 0 && (
          <div className="flex flex-col justify-center items-center py-12">
            <div className="animate-spin text-blue-500">
              <SpinnerIcon className="w-8 h-8" />
            </div>
            <p className="text-gray-400 text-sm">Loading your to-do lists...</p>
          </div>
        )}

        {/* Lists Grid */}
        {!loading && lists.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <ListView
                key={list.id}
                list={list}
                onUpdateList={(name) => updateList(list.id, name)}
                onAddItem={(name, description) =>
                  addItem(list.id, { name, description })
                }
                onUpdateItem={(itemId, data) =>
                  updateItem(list.id, itemId, data)
                }
                onUpdateItemPositions={(newPositions) =>
                  updateItemPositions(list.id, newPositions)
                }
                onDeleteItem={(itemId) => deleteItem(list.id, itemId)}
                onDeleteList={() => deleteList(list.id)}
                isLoading={loading}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
