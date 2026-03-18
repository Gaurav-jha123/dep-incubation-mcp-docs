import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
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
  it("renders the rearrange section with title and instructions", () => {
    render(
      <SkillMatrixColumnRearrange
        topics={mockTopics}
        onOrderChange={vi.fn()}
      />
    );
    
    expect(screen.getByText("Rearrange Columns")).toBeDefined();
    expect(screen.getByText("Drag and drop topics to reorder the column list.")).toBeDefined();
  });

  it("renders the sortable topics list directly", () => {
    render(
      <SkillMatrixColumnRearrange
        topics={mockTopics}
        onOrderChange={vi.fn()}
      />
    );

    // Verify topics are rendered directly without needing to click anything
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("TypeScript")).toBeDefined();
    
    // Verify drag handles are present for each topic
    expect(screen.getByLabelText("Drag topic-1")).toBeDefined();
    expect(screen.getByLabelText("Drag topic-2")).toBeDefined();
  });
});