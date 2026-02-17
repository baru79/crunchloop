import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ListView } from "./ListView";
import type { TodoList } from "../types";

// Mock useTheme
vi.mock("../hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light" }),
}));

// Mock dnd
vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Droppable: ({
    children,
  }: {
    children: (provided: {
      droppableProps: Record<string, unknown>;
      innerRef: React.Ref<HTMLElement>;
      placeholder: React.ReactNode;
    }) => React.ReactNode;
  }) =>
    children({
      droppableProps: {},
      innerRef: () => {},
      placeholder: null,
    }),
  Draggable: ({
    children,
  }: {
    children: (provided: {
      draggableProps: Record<string, unknown>;
      dragHandleProps: Record<string, unknown>;
      innerRef: React.Ref<HTMLElement>;
    }) => React.ReactNode;
  }) =>
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: () => {},
    }),
}));

const mockList: TodoList = {
  id: 1,
  name: "My List",
  todoItems: [
    { id: 1, name: "Task 1", description: "Desc 1", done: false },
    { id: 2, name: "Task 2", description: "Desc 2", done: true },
  ],
};

describe("ListView", () => {
  it("renders list name and items", () => {
    render(
      <ListView
        list={mockList}
        onUpdateList={vi.fn()}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onUpdateItemPositions={vi.fn()}
        onDeleteItem={vi.fn()}
        onDeleteList={vi.fn()}
      />,
    );

    expect(screen.getByText("My List")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("filters items correctly", () => {
    render(
      <ListView
        list={mockList}
        onUpdateList={vi.fn()}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onUpdateItemPositions={vi.fn()}
        onDeleteItem={vi.fn()}
        onDeleteList={vi.fn()}
      />,
    );

    // Open filter menu
    const filterBtn = screen.getByTitle("Filter tasks");
    fireEvent.click(filterBtn);

    // Click "Pending"
    const pendingBtn = screen.getByText(/Pending/);
    fireEvent.click(pendingBtn);

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.queryByText("Task 2")).not.toBeInTheDocument();

    // Open filter menu again
    fireEvent.click(filterBtn);

    // Click "Done"
    const doneBtn = screen.getByText(/Done/);
    fireEvent.click(doneBtn);

    expect(screen.queryByText("Task 1")).not.toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("adds a new item", async () => {
    const onAddItem = vi.fn();
    render(
      <ListView
        list={mockList}
        onUpdateList={vi.fn()}
        onAddItem={onAddItem}
        onUpdateItem={vi.fn()}
        onUpdateItemPositions={vi.fn()}
        onDeleteItem={vi.fn()}
        onDeleteList={vi.fn()}
      />,
    );

    const input = screen.getByPlaceholderText("Add your task...");
    fireEvent.change(input, { target: { value: "New Task" } });

    const form = input.closest("form");
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(onAddItem).toHaveBeenCalledWith("New Task", "");
    });
  });

  it("deletes the list after confirmation", async () => {
    const onDeleteList = vi.fn();
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <ListView
        list={mockList}
        onUpdateList={vi.fn()}
        onAddItem={vi.fn()}
        onUpdateItem={vi.fn()}
        onUpdateItemPositions={vi.fn()}
        onDeleteItem={vi.fn()}
        onDeleteList={onDeleteList}
      />,
    );

    const deleteBtn = screen.getByTitle("Delete list");
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(onDeleteList).toHaveBeenCalled();
  });
});
