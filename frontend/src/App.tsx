import { CreateListForm } from "./components/CreateListForm";
import { ListView } from "./components/ListView";
import { SpinnerIcon } from "./components/icons/SpinnerIcon";
import { LightIcon } from "./components/icons/LightIcon";
import { DarkIcon } from "./components/icons/DarkIcon";
import { useTodoLists } from "./hooks/useTodoLists";
import { cn } from "./utils";
import { useTheme } from "./hooks/useTheme";

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

  return (
    <div
      className={cn("min-h-screen p-4 relative", {
        "dark bg-slate-950": darkMode,
        "bg-gray-100": !darkMode,
      })}
    >
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={cn(
            "p-2 rounded-full transition-colors border hover:cursor-pointer",
            {
              "bg-gray-800 border-gray-700 text-white hover:bg-gray-700":
                darkMode,
              "border-gray-200 text-gray-600 hover:bg-gray-100": !darkMode,
            },
          )}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <LightIcon className="w-6 h-6" />
          ) : (
            <DarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      <div className="max-w-6xl mx-auto relative">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Create List Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mb-6">
          <div></div>
          <div>
            <CreateListForm
              lists={lists}
              onSubmit={(name) => createList({ name })}
              isLoading={loading}
            />
          </div>
          <div></div>
        </div>

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
