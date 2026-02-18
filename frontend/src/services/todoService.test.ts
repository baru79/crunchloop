import { describe, it, expect, vi } from "vitest";
import { todoService } from "./todoService";
import type { TodoItem, TodoList } from "../types";

const BASE_URL = "http://localhost:4000/api";

const mockFetchResponse = <T>(
  data: T,
  ok = true,
  status = 200,
  statusText = "OK",
) => {
  vi.mocked(fetch).mockResolvedValue({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(data),
  } as Response);
};

describe("todoService", () => {
  const EXPECTED_HEADERS = { "Content-Type": "application/json" };
  describe("getTodoLists", () => {
    it("should fetch todo lists successfully", async () => {
      const mockLists: TodoList[] = [
        { id: 1, name: "Groceries", todoItems: [] },
      ];
      mockFetchResponse(mockLists);

      const result = await todoService.getTodoLists();

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/todo-lists`);
      expect(result).toEqual(mockLists);
    });

    it("should include status info in error message when getTodoLists fails", async () => {
      mockFetchResponse({}, false, 500, "Internal Server Error");

      await expect(todoService.getTodoLists()).rejects.toThrow(
        /Failed to fetch todo lists: 500 Internal Server Error/,
      );
    });
  });

  describe("getTodoListById", () => {
    it("should fetch a single todo list successfully", async () => {
      const mockList: TodoList = { id: 1, name: "Groceries", todoItems: [] };

      mockFetchResponse(mockList);

      const result = await todoService.getTodoListById(1);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/todo-lists/1`);

      expect(result).toEqual(mockList);
    });

    it("should include status info in error message when getTodoListById fails", async () => {
      mockFetchResponse({}, false, 400, "Bad Request");

      await expect(todoService.getTodoListById(999)).rejects.toThrow(
        /Failed to fetch todo list: 400 Bad Request/,
      );
    });
  });

  describe("createTodoList", () => {
    it("should create a new todo list with correct payload", async () => {
      const newList: TodoList = { id: 3, name: "New List", todoItems: [] };
      mockFetchResponse(newList);

      const payload = { name: "New List" };
      const result = await todoService.createTodoList(payload);

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists`,
        expect.objectContaining({
          method: "POST",
          headers: EXPECTED_HEADERS,
          body: JSON.stringify(payload),
        }),
      );
      expect(result).toEqual(newList);
    });

    it("should include status info in error message when createTodoList fails", async () => {
      mockFetchResponse({}, false, 400, "Bad Request");

      await expect(todoService.createTodoList({ name: "" })).rejects.toThrow(
        /Failed to create todo list: 400 Bad Request/,
      );
    });
  });

  describe("deleteTodoList", () => {
    it("should delete a todo list successfully", async () => {
      const newList: TodoList = { id: 1, name: "New List", todoItems: [] };
      mockFetchResponse(newList);

      await todoService.deleteTodoList(1);

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists/1`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should include status info in error message when deleteTodoList fails", async () => {
      mockFetchResponse({}, false, 500, "Internal Server Error");

      await expect(todoService.deleteTodoList(1)).rejects.toThrow(
        /Failed to delete todo list: 500 Internal Server Error/,
      );
    });
  });

  describe("updateTodoList", () => {
    it("should update a todo list successfully", async () => {
      const updatedList: TodoList = {
        id: 1,
        name: "Updated Name",
        todoItems: [],
      };

      mockFetchResponse(updatedList);

      const result = await todoService.updateTodoList(1, "Updated Name");

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists/1`,
        expect.objectContaining({
          method: "PUT",
          headers: EXPECTED_HEADERS,
          body: JSON.stringify({ name: "Updated Name" }),
        }),
      );

      expect(result).toEqual(updatedList);
    });

    it("should include status info in error message when updateTodoList fails", async () => {
      mockFetchResponse({}, false, 500, "Internal Server Error");

      await expect(todoService.updateTodoList(1, "New Name")).rejects.toThrow(
        /Failed to update todo list: 500 Internal Server Error/,
      );
    });
  });

  describe("createTodoItem", () => {
    it("should create a new todo item", async () => {
      const newItem: TodoItem = { id: 101, name: "Milk", done: false };

      mockFetchResponse(newItem);

      const result = await todoService.createTodoItem(1, { name: "Milk" });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists/1/todo-items`,
        expect.objectContaining({
          method: "POST",
          headers: EXPECTED_HEADERS,
          body: JSON.stringify({ name: "Milk" }),
        }),
      );
      expect(result).toEqual(newItem);
    });

    it("should include status info in error message when createTodoItem fails", async () => {
      mockFetchResponse({}, false, 500, "Internal Server Error");

      await expect(
        todoService.createTodoItem(1, { name: "Item" }),
      ).rejects.toThrow(
        /Failed to create todo item: 500 Internal Server Error/,
      );
    });
  });

  describe("updateTodoItem", () => {
    it("should update a todo item successfully", async () => {
      const updatedItem: TodoItem = { id: 101, name: "Milk", done: true };

      mockFetchResponse(updatedItem);

      const result = await todoService.updateTodoItem(1, 101, { done: true });

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists/1/todo-items/101`,
        expect.objectContaining({
          method: "PUT",
          headers: EXPECTED_HEADERS,
          body: JSON.stringify({ done: true }),
        }),
      );
      expect(result).toEqual(updatedItem);
    });

    it("should include status info in error message when updateTodoItem fails", async () => {
      mockFetchResponse({}, false, 500, "Internal Server Error");

      await expect(
        todoService.updateTodoItem(1, 101, { done: true }),
      ).rejects.toThrow(
        /Failed to update todo item: 500 Internal Server Error/,
      );
    });
  });

  describe("deleteTodoItem", () => {
    it("should delete a todo item successfully", async () => {
      mockFetchResponse({ ok: true });

      await todoService.deleteTodoItem(1, 101);

      expect(fetch).toHaveBeenCalledWith(
        `${BASE_URL}/todo-lists/1/todo-items/101`,
        expect.objectContaining({ method: "DELETE" }),
      );
    });

    it("should include status info in error message when deleteTodoItem fails", async () => {
      mockFetchResponse({} as unknown, false, 500, "Internal Server Error");

      await expect(todoService.deleteTodoItem(1, 101)).rejects.toThrow(
        /Failed to delete todo item: 500 Internal Server Error/,
      );
    });
  });
});
