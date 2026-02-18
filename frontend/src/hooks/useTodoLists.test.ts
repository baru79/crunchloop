import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTodoLists } from "./useTodoLists";
import { todoService } from "../services/todoService";
import type { TodoList, TodoItem } from "../types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock the todoService
vi.mock("../services/todoService", () => ({
  todoService: {
    getTodoLists: vi.fn(() => Promise.resolve([])),
    createTodoList: vi.fn(() =>
      Promise.resolve({ id: 0, name: "", todoItems: [] }),
    ),
    deleteTodoList: vi.fn(() => Promise.resolve()),
    updateTodoList: vi.fn(() =>
      Promise.resolve({ id: 0, name: "", todoItems: [] }),
    ),
    createTodoItem: vi.fn(() =>
      Promise.resolve({ id: 0, name: "", done: false }),
    ),
    updateTodoItem: vi.fn(() =>
      Promise.resolve({ id: 0, name: "", done: false }),
    ),
    deleteTodoItem: vi.fn(() => Promise.resolve()),
  },
}));

const mockInitialLists: TodoList[] = [
  {
    id: 1,
    name: "Groceries",
    todoItems: [
      {
        id: 101,
        name: "Milk",
        description: "2% fat",
        done: false,
      },
      { id: 102, name: "Bread", description: "", done: true },
    ],
  },
  {
    id: 2,
    name: "Work Tasks",
    todoItems: [
      {
        id: 201,
        name: "Finish report",
        description: "",
        done: false,
      },
    ],
  },
];

describe("useTodoLists", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    // Clear localStorage mock
    localStorageMock.clear();
  });

  it("should initialize with empty lists and loading state", async () => {
    // Mock getTodoLists to never resolve (keep pending)
    vi.mocked(todoService.getTodoLists).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useTodoLists());
    expect(result.current.lists).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("should fetch todo lists on mount and update state", async () => {
    vi.mocked(todoService.getTodoLists).mockResolvedValue(mockInitialLists);

    const { result } = renderHook(() => useTodoLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.lists).toEqual(mockInitialLists);
      expect(todoService.getTodoLists).toHaveBeenCalledTimes(1);
    });
  });

  it("should handle error when fetching todo lists fails", async () => {
    const errorMessage = "Network error";
    vi.mocked(todoService.getTodoLists).mockResolvedValue(
      Promise.reject(new Error(errorMessage)) as unknown as TodoList[],
    );

    const { result } = renderHook(() => useTodoLists());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.lists).toEqual([]);
    });
  });

  it("should create a new todo list and update state", async () => {
    vi.mocked(todoService.getTodoLists).mockResolvedValue(mockInitialLists);

    const newListName = "New List";
    const createdList: TodoList = { id: 3, name: newListName, todoItems: [] };
    vi.mocked(todoService.createTodoList).mockResolvedValue(createdList);

    const { result } = renderHook(() => useTodoLists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.createList({ name: newListName });
    });

    expect(todoService.createTodoList).toHaveBeenCalledWith({
      name: newListName,
    });
    expect(result.current.lists).toEqual([...mockInitialLists, createdList]);
    expect(result.current.loading).toBe(false);
  });

  it("should delete a todo list and update state", async () => {
    vi.mocked(todoService.getTodoLists).mockResolvedValue(mockInitialLists);
    vi.mocked(todoService.deleteTodoList).mockResolvedValue(undefined);

    const { result } = renderHook(() => useTodoLists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.deleteList(1);
    });

    expect(todoService.deleteTodoList).toHaveBeenCalledWith(1);
    expect(result.current.lists).toEqual([mockInitialLists[1]]);
    expect(result.current.loading).toBe(false);
  });

  it("should update a todo list name and update state", async () => {
    vi.mocked(todoService.getTodoLists).mockResolvedValue(mockInitialLists);

    const updatedName = "Updated Groceries";
    const updatedList: TodoList = {
      ...mockInitialLists[0],
      name: updatedName,
    };
    vi.mocked(todoService.updateTodoList).mockResolvedValue(updatedList);

    const { result } = renderHook(() => useTodoLists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.updateList(1, updatedName);
    });

    expect(todoService.updateTodoList).toHaveBeenCalledWith(1, updatedName);
    expect(result.current.lists[0].name).toBe(updatedName);
    expect(result.current.loading).toBe(false);
  });

  it("should add an item to a todo list and update state", async () => {
    vi.mocked(todoService.getTodoLists).mockResolvedValue(mockInitialLists);

    const newItem: TodoItem = {
      id: 103,
      name: "Apples",
      description: "",
      done: false,
    };
    vi.mocked(todoService.createTodoItem).mockResolvedValue(newItem);

    const { result } = renderHook(() => useTodoLists());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.addItem(1, { name: "Apples", description: "" });
    });

    expect(todoService.createTodoItem).toHaveBeenCalledWith(1, {
      name: "Apples",
      description: "",
    });
    expect(result.current.lists[0].todoItems).toContainEqual(newItem);
    expect(result.current.loading).toBe(false);
  });

  it("should clear the error message", async () => {
    const errorMessage = "Test Error";
    vi.mocked(todoService.getTodoLists).mockResolvedValue(
      Promise.reject(new Error(errorMessage)) as unknown as TodoList[],
    );

    const { result } = renderHook(() => useTodoLists());

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});
