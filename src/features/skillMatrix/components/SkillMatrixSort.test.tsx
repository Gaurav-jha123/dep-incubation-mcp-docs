import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SkillMatrixSort from "./SkillMatrixSort";

const mockColumnOptions = ["Name", "React", "TypeScript", "Node.js"];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SkillMatrixSort", () => {
  it("renders the sort options correctly based on props", () => {
    render(
      <SkillMatrixSort
        sortColumn="Name"
        sortOrder="ascending"
        columnOptions={mockColumnOptions}
        onSortColumnChange={vi.fn()}
        onSortOrderChange={vi.fn()}
      />
    );

    expect(screen.getByText("Sort By")).not.toBeNull();
    expect(screen.getByText("Order")).not.toBeNull();

    // Grab by index instead of accessible name
    const selects = screen.getAllByRole("combobox") as HTMLSelectElement[];
    const sortColumnSelect = selects[0];
    const sortOrderSelect = selects[1];

    expect(sortColumnSelect.value).toBe("Name");
    expect(sortOrderSelect.value).toBe("ascending");
    
    mockColumnOptions.forEach(option => {
      expect(screen.getByRole("option", { name: option })).not.toBeNull();
    });
  });

  it("calls onSortColumnChange when a new column is selected", () => {
    const onSortColumnChangeMock = vi.fn();
    
    render(
      <SkillMatrixSort
        sortColumn="Name"
        sortOrder="ascending"
        columnOptions={mockColumnOptions}
        onSortColumnChange={onSortColumnChangeMock}
        onSortOrderChange={vi.fn()}
      />
    );

    const sortColumnSelect = screen.getAllByRole("combobox")[0];
    
    fireEvent.change(sortColumnSelect, { target: { value: "TypeScript" } });

    expect(onSortColumnChangeMock).toHaveBeenCalledTimes(1);
    expect(onSortColumnChangeMock).toHaveBeenCalledWith("TypeScript");
  });

  it("calls onSortOrderChange when a new order is selected", () => {
    const onSortOrderChangeMock = vi.fn();
    
    render(
      <SkillMatrixSort
        sortColumn="Name"
        sortOrder="ascending"
        columnOptions={mockColumnOptions}
        onSortColumnChange={vi.fn()}
        onSortOrderChange={onSortOrderChangeMock}
      />
    );

    const sortOrderSelect = screen.getAllByRole("combobox")[1];
    
    fireEvent.change(sortOrderSelect, { target: { value: "descending" } });

    expect(onSortOrderChangeMock).toHaveBeenCalledTimes(1);
    expect(onSortOrderChangeMock).toHaveBeenCalledWith("descending");
  });
});