import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ItemRow } from "./ItemRow";
import type { TodoItem } from "../types";

// Mock useTheme
vi.mock("../hooks/useTheme", () => ({
  useTheme: () => ({ theme: "light" }),
}));

const mockItem: TodoItem = {
  id: 1,
  name: "Test Item",
  description: "Test Description",
  done: false,
};

describe("ItemRow", () => {
  it("renders item details correctly", () => {
    render(
      <ItemRow
        item={mockItem}
        onToggleDone={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Item")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("calls onToggleDone when checkbox is clicked", () => {
    const onToggleDone = vi.fn();
    render(
      <ItemRow
        item={mockItem}
        onToggleDone={onToggleDone}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    const checkboxBtn = screen.getByTitle("Mark as done");
    fireEvent.click(checkboxBtn);

    expect(onToggleDone).toHaveBeenCalledWith(mockItem.id, true);
  });

  it("enters edit mode and updates item", async () => {
    const onUpdate = vi.fn();
    render(
      <ItemRow
        item={mockItem}
        onToggleDone={vi.fn()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />,
    );

    // Find edit button (title="Edit task")
    const editBtn = screen.getByTitle("Edit task");
    fireEvent.click(editBtn);

    // Inputs should appear
    const nameInput = screen.getByDisplayValue("Test Item");
    const descInput = screen.getByDisplayValue("Test Description");

    fireEvent.change(nameInput, { target: { value: "Updated Item" } });
    fireEvent.change(descInput, { target: { value: "Updated Description" } });

    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        mockItem.id,
        "Updated Item",
        "Updated Description",
      );
    });
  });

  it("calls onDelete when delete button is clicked and confirmed", async () => {
    const onDelete = vi.fn();
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    render(
      <ItemRow
        item={mockItem}
        onToggleDone={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />,
    );

    const deleteBtn = screen.getByTitle("Delete task");
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(mockItem.id);
  });
});
