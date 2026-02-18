import type {
  TodoList,
  TodoItem,
  CreateTodoListDTO,
  CreateTodoItemDTO,
  UpdateTodoItemDTO,
} from "../types";
import { handleResponseError } from "../utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const todoService = {
  // TODO Lists
  getTodoLists: async (): Promise<TodoList[]> => {
    const response = await fetch(`${API_URL}/todo-lists`);
    if (!response.ok)
      handleResponseError("Failed to fetch todo lists", response);
    return response.json();
  },

  getTodoListById: async (id: number): Promise<TodoList> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`);
    if (!response.ok)
      handleResponseError("Failed to fetch todo list", response);
    return response.json();
  },

  createTodoList: async (data: CreateTodoListDTO): Promise<TodoList> => {
    const url = `${API_URL}/todo-lists`;
    const body = JSON.stringify(data);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    });
    if (!response.ok)
      handleResponseError("Failed to create todo list", response);
    return response.json();
  },

  deleteTodoList: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`, {
      method: "DELETE",
    });
    if (!response.ok)
      handleResponseError("Failed to delete todo list", response);
  },

  updateTodoList: async (id: number, name: string): Promise<TodoList> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok)
      handleResponseError("Failed to update todo list", response);
    return response.json();
  },

  // TODO Items
  createTodoItem: async (
    listId: number,
    data: CreateTodoItemDTO,
  ): Promise<TodoItem> => {
    const response = await fetch(`${API_URL}/todo-lists/${listId}/todo-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok)
      handleResponseError("Failed to create todo item", response);
    return response.json();
  },

  updateTodoItem: async (
    listId: number,
    itemId: number,
    data: UpdateTodoItemDTO,
  ): Promise<TodoItem> => {
    const response = await fetch(
      `${API_URL}/todo-lists/${listId}/todo-items/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok)
      handleResponseError("Failed to update todo item", response);
    return response.json();
  },

  deleteTodoItem: async (listId: number, itemId: number): Promise<void> => {
    const response = await fetch(
      `${API_URL}/todo-lists/${listId}/todo-items/${itemId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok)
      handleResponseError("Failed to delete todo item", response);
  },
};
