import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SkillMatrixColumnRearrange from "./SkillMatrixColumnRearrange";

// 1. Mock the DnD libraries BEFORE the component imports them to prevent the crash
vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-mock">{children}</div>,
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ isDragging: false }),
}));

vi.mock('@dnd-kit/helpers', () => ({
  move: vi.fn(),
}));

const mockTopics = [
  { id: "topic-1", label: "React" },
  { id: "topic-2", label: "TypeScript" },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SkillMatrixColumnRearrange", () => {
  it("renders the rearrange trigger button", () => {
    render(
      <SkillMatrixColumnRearrange
        topics={mockTopics}
        onOrderChange={vi.fn()}
      />
    );
    
    expect(screen.getByRole("button", { name: "Rearrange Columns" })).not.toBeNull();
  });

  it("opens the modal and renders the list when clicked", () => {
    render(
      <SkillMatrixColumnRearrange
        topics={mockTopics}
        onOrderChange={vi.fn()}
      />
    );

    // Using fireEvent for simplicity
    const triggerButton = screen.getByRole("button", { name: "Rearrange Columns" });
    fireEvent.click(triggerButton);

    // Verify it opened safely
    expect(screen.getByText("Rearrange Skill Matrix Columns")).not.toBeNull();
    expect(screen.getByText("React")).not.toBeNull();
    expect(screen.getByText("TypeScript")).not.toBeNull();
  });
});