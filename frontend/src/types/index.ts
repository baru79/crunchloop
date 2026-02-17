export interface TodoItem {
  id: number;
  name: string;
  description?: string;
  done: boolean;
}

export interface TodoList {
  id: number;
  name: string;
  todoItems: TodoItem[];
}

export interface CreateTodoListDTO {
  name: string;
}

export interface CreateTodoItemDTO {
  name: string;
  description?: string;
}

export interface UpdateTodoItemDTO {
  name?: string;
  description?: string;
  done?: boolean;
}

export type Theme = "light" | "dark";
