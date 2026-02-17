import { useState, useEffect, useCallback } from "react";
import type { TodoList, TodoItem, UpdateTodoItemDTO } from "../types";
import { todoService } from "../services/todoService";
import { getLocalStorageLists, setLocalStorageLists } from "../utils";

export const useTodoManager = () => {
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchLists = useCallback(async () => {
    setLoading(true);
    try {
      const storedLists = getLocalStorageLists();
      if (storedLists && storedLists.length > 0) {
        setLists(storedLists);
      } else {
        const data = await todoService.getTodoLists();
        setLists(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      throw err;
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  useEffect(() => {
    if (isInitialized) {
      setLocalStorageLists(lists);
    }
  }, [lists, isInitialized]);

  const createList = useCallback(async ({ name }: { name: string }) => {
    try {
      const newList = await todoService.createTodoList({ name });
      setLists((prev) => [...prev, newList]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
      throw err;
    }
  }, []);

  const deleteList = useCallback(async (id: number) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    try {
      await todoService.deleteTodoList(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list");
      throw err;
    }
  }, []);

  const updateList = useCallback(async (id: number, name: string) => {
    setLists((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
    try {
      await todoService.updateTodoList(id, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update list");
      throw err;
    }
  }, []);

  const addItem = useCallback(
    async (
      listId: number,
      { name, description }: { name: string; description: string },
    ) => {
      try {
        const newItem = await todoService.createTodoItem(listId, {
          name,
          description,
        });
        setLists((prev) =>
          prev.map((l) =>
            l.id === listId
              ? { ...l, todoItems: [...l.todoItems, newItem] }
              : l,
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add item");
        throw err;
      }
    },
    [],
  );

  const updateItem = useCallback(
    async (listId: number, itemId: number, data: UpdateTodoItemDTO) => {
      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== listId) return l;
          return {
            ...l,
            todoItems: l.todoItems.map((i) =>
              i.id === itemId ? { ...i, ...data } : i,
            ),
          };
        }),
      );
      try {
        await todoService.updateTodoItem(listId, itemId, data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update item");
        throw err;
      }
    },
    [],
  );

  const updateItemPositions = useCallback(
    async (listId: number, newPositions: number[]) => {
      try {
        setError(null);
        setLists((prev) =>
          prev.map((l) => {
            if (l.id !== listId) return l;
            const itemMap = new Map(l.todoItems.map((i) => [i.id, i]));
            const newItems = newPositions
              .map((id) => itemMap.get(id))
              .filter((i): i is TodoItem => !!i);
            return { ...l, todoItems: newItems };
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update item positions",
        );
        throw err;
      }
    },
    [],
  );

  const deleteItem = useCallback(async (listId: number, itemId: number) => {
    setLists((prev) =>
      prev.map((l) =>
        l.id === listId
          ? { ...l, todoItems: l.todoItems.filter((i) => i.id !== itemId) }
          : l,
      ),
    );
    try {
      await todoService.deleteTodoItem(listId, itemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete item");
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    lists,
    loading,
    error,
    fetchLists,
    createList,
    deleteList,
    updateList,
    addItem,
    updateItem,
    updateItemPositions,
    deleteItem,
    clearError,
  };
};
