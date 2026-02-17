import type {
  TodoList,
  TodoItem,
  CreateTodoListDTO,
  CreateTodoItemDTO,
  UpdateTodoItemDTO,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export const todoService = {
  // TODO Lists
  getTodoLists: async (): Promise<TodoList[]> => {
    const response = await fetch(`${API_URL}/todo-lists`);
    if (!response.ok) throw new Error("Failed to fetch todo lists");
    return response.json();
  },

  getTodoListById: async (id: number): Promise<TodoList> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`);
    if (!response.ok) throw new Error("Failed to fetch todo list");
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
      throw new Error(
        `Failed to create todo list: ${response.status} ${response.statusText}`,
      );

    return response.json();
  },

  deleteTodoList: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo list");
  },

  updateTodoList: async (id: number, name: string): Promise<TodoList> => {
    const response = await fetch(`${API_URL}/todo-lists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error("Failed to update todo list");
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
    if (!response.ok) throw new Error("Failed to create todo item");
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
    if (!response.ok) throw new Error("Failed to update todo item");
    return response.json();
  },

  deleteTodoItem: async (listId: number, itemId: number): Promise<void> => {
    const response = await fetch(
      `${API_URL}/todo-lists/${listId}/todo-items/${itemId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error("Failed to delete todo item");
  },
};
