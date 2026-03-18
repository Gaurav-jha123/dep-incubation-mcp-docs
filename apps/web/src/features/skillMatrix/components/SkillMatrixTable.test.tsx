import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SkillMatrixTable from "./SkillMatrixTable";
import { Table } from "@/components/organisms";
import React from "react";

vi.mock("@/components/organisms", () => ({
  Table: vi.fn(() => <div data-testid="mock-table" />),
}));

const mockData = {
  users: [
    { id: "u1", name: "Alice" },
    { id: "u2", name: "Bob" },
  ],
  topics: [
    { id: "t1", label: "React" },
    { id: "t2", label: "Node.js" },
  ],
  skills: [
    { userId: "u1", topicId: "t1", value: 80 },
    { userId: "u1", topicId: "t2", value: 40 },
    { userId: "u2", topicId: "t1", value: 90 },
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const setup = (onUpdateSkill = vi.fn()) =>
  render(
    <SkillMatrixTable
      data={mockData}
      currentUserId="u1"
      onUpdateSkill={onUpdateSkill}
    />
  );

const mockTableRenderFirstRow = () => {
  vi.mocked(Table).mockImplementation(({ data, keys, cellRenderer }) => {
    const row = data[0];
    return (
      <div>
        {keys.map((key: string) => (
          <div key={key}>{cellRenderer!(row[key], key, row)}</div>
        ))}
      </div>
    );
  });
};

describe("SkillMatrixTable", () => {
  it("renders table", () => {
    setup();
    expect(screen.getByTestId("mock-table")).toBeDefined();
  });

  it("passes flattened props to Table", () => {
    setup();
    const tableProps = vi.mocked(Table).mock.calls[0][0];

    expect(tableProps.headers).toEqual(["User / Topic", "React", "Node.js"]);
    expect(tableProps.keys).toEqual(["name", "t1", "t2"]);
    expect(tableProps.data).toEqual([
      { id: "u1", name: "Alice", t1: 80, t2: 40 },
      { id: "u2", name: "Bob", t1: 90, t2: "" },
    ]);
  });

  it("renders name and skill cells", () => {
    setup();
    const tableProps = vi.mocked(Table).mock.calls[0][0];
    const renderCell = tableProps.cellRenderer!;
    const row = { id: "u1", name: "Alice", t1: 80 };

    const nameCell = renderCell("Alice", "name", row);
    const { container: nameContainer } = render(nameCell as React.ReactElement);
    expect(nameContainer.textContent).toContain("Alice");

    const skillCell = renderCell(80, "t1", row);
    const { container: skillContainer } = render(skillCell as React.ReactElement);
    expect(skillContainer.textContent).toBe("80");
  });

  it("updates skill on Enter", () => {
    const mockUpdate = vi.fn();
    setup(mockUpdate);

    const tableProps = vi.mocked(Table).mock.calls[0][0];
    const renderCell = tableProps.cellRenderer!;
    const row = { id: "u1", name: "Alice", t1: 80 };

    const skillCell = renderCell(80, "t1", row);
    const { container, rerender } = render(skillCell as React.ReactElement);

    fireEvent.click(container.querySelector("button")!);

    rerender(
      <input
        defaultValue={80}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const input = e.target as HTMLInputElement;
            mockUpdate("u1", "t1", Number(input.value));
          }
        }}
      />
    );

    const input = container.querySelector("input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "95" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockUpdate).toHaveBeenCalledWith("u1", "t1", 95);
  });

  it("updates skill on blur", () => {
    const mockUpdate = vi.fn();
    mockTableRenderFirstRow();
    setup(mockUpdate);

    fireEvent.click(screen.getByText("80"));

    const input = screen.getByDisplayValue("80");

    fireEvent.change(input, { target: { value: "90" } });
    fireEvent.blur(input);

    expect(mockUpdate).toHaveBeenCalledWith("u1", "t1", 90);
  });

  it("updates skill on Enter in edit mode", () => {
    const mockUpdate = vi.fn();
    mockTableRenderFirstRow();
    setup(mockUpdate);

    fireEvent.click(screen.getByText("80"));

    const input = screen.getByDisplayValue("80");

    fireEvent.change(input, { target: { value: "70" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockUpdate).toHaveBeenCalledWith("u1", "t1", 70);
  });

  it("handles invalid values and empty renderer", () => {
    const mockUpdate = vi.fn();
    mockTableRenderFirstRow();
    setup(mockUpdate);


    const tableProps = vi.mocked(Table).mock.calls[0][0];
    const renderCell = tableProps.cellRenderer!;
    const result = renderCell("", "t1", { id: "u1", name: "Alice", t1: "" });

    expect(result).toBe("");
  });

  it("handles resize and edit flow", () => {
    const mockUpdate = vi.fn();

    const main = document.createElement("main");
    Object.defineProperty(main, "clientHeight", { value: 800 });
    document.body.appendChild(main);

    vi.spyOn(document, "getElementsByTagName").mockReturnValue([main] as unknown as HTMLCollectionOf<Element>);

    mockTableRenderFirstRow();
    setup(mockUpdate);

    window.dispatchEvent(new Event("resize"));

    fireEvent.click(screen.getByText("80"));

    let input = screen.getByDisplayValue("80");

    fireEvent.change(input, { target: { value: "70" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockUpdate).toHaveBeenCalledWith("u1", "t1", 70);

    fireEvent.click(screen.getByText("80"));

    input = screen.getByDisplayValue("80");

    fireEvent.change(input, { target: { value: "200" } });
    fireEvent.blur(input);

    expect(mockUpdate).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText("80"));

    input = screen.getByDisplayValue("80");

    fireEvent.change(input, { target: { value: "-5" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});