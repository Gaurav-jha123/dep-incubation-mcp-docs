import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import { move } from "@dnd-kit/helpers";
import SkillMatrixColumnRearrange from "./SkillMatrixColumnRearrange";

let capturedOnDragEnd: ((event: unknown) => void) | null = null;

vi.mock('@dnd-kit/react', () => ({
  DragDropProvider: ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (event: unknown) => void }) => {
    capturedOnDragEnd = onDragEnd;
    return <div data-testid="dnd-mock">{children}</div>;
  },
}));

vi.mock('@dnd-kit/react/sortable', () => ({
  useSortable: () => ({ isDragging: false }),
}));

vi.mock('@dnd-kit/helpers', () => ({
  move: vi.fn(),
}));

const topics = [
  { id: "topic-1", label: "React" },
  { id: "topic-2", label: "TypeScript" },
];
const mockMove = move as ReturnType<typeof vi.fn>;

function renderWith(onOrderChange = vi.fn(), opts?: { className?: string }) {
  return { onOrderChange, ...render(
    <SkillMatrixColumnRearrange topics={topics} onOrderChange={onOrderChange} className={opts?.className} />
  )};
}

function drag(event: unknown) {
  act(() => capturedOnDragEnd!(event));
}

afterEach(() => {
  cleanup();
  capturedOnDragEnd = null;
  vi.clearAllMocks();
});

describe("SkillMatrixColumnRearrange", () => {
  it("renders title, instructions, sortable topics, and applies className", () => {
    const { container } = render(
      <SkillMatrixColumnRearrange topics={topics} onOrderChange={vi.fn()} className="custom" />
    );
    expect(screen.getByText("Rearrange Columns")).toBeDefined();
    expect(screen.getByText("Drag and drop topics to reorder the column list.")).toBeDefined();
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("TypeScript")).toBeDefined();
    expect(screen.getByLabelText("Drag topic-1")).toBeDefined();
    expect((container.firstChild as HTMLElement).className).toContain("custom");
  });

  it("updates items when topics prop changes", () => {
    const { rerender } = renderWith();
    rerender(<SkillMatrixColumnRearrange topics={[{ id: "t3", label: "Vue" }]} onOrderChange={vi.fn()} />);
    expect(screen.getByText("Vue")).toBeDefined();
    expect(screen.queryByText("React")).toBeNull();
  });

  it("ignores invalid drop events (null, falsy over/target/collision, no keys)", () => {
    const { onOrderChange } = renderWith();
    [null, {}, { over: null }, { target: null }, { collision: null }].forEach(drag);
    expect(onOrderChange).not.toHaveBeenCalled();
  });

  it("ignores when move throws, returns wrong length, unknown ids, or same order", () => {
    const { onOrderChange } = renderWith();

    mockMove.mockImplementation(() => { throw new Error("fail"); });
    drag({ over: true });

    mockMove.mockReturnValue(["topic-1"]);
    drag({ over: true });

    mockMove.mockReturnValue(["topic-1", "topic-99"]);
    drag({ over: true });

    mockMove.mockReturnValue(["topic-1", "topic-2"]);
    drag({ over: true });

    expect(onOrderChange).not.toHaveBeenCalled();
  });

  it("rejects reorder when previous items have duplicates causing set size mismatch", () => {
    const { onOrderChange } = renderWith();
    mockMove.mockReturnValue(["topic-1", "topic-1"]);
    drag({ over: true });
    onOrderChange.mockClear();

    mockMove.mockReturnValue(["topic-2", "topic-1"]);
    drag({ over: true });
    expect(onOrderChange).not.toHaveBeenCalled();
  });

  it("calls onOrderChange on valid reorder via over, target, and collision", () => {
    mockMove.mockReturnValue(["topic-2", "topic-1"]);

    const r1 = renderWith();
    drag({ over: true });
    expect(r1.onOrderChange).toHaveBeenCalledWith(["topic-2", "topic-1"]);
    r1.unmount();

    const r2 = renderWith();
    drag({ target: true });
    expect(r2.onOrderChange).toHaveBeenCalledWith(["topic-2", "topic-1"]);
    r2.unmount();

    const r3 = renderWith();
    drag({ collision: true });
    expect(r3.onOrderChange).toHaveBeenCalledWith(["topic-2", "topic-1"]);
  });
});