import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SkillMatrixTable from "./SkillMatrixTable";
import { Table } from "@/components/organisms";

// 1. Mock the UI Toolkit Table so we don't have to render a massive real table
vi.mock("@/components/organisms", () => ({
  Table: vi.fn(() => <div data-testid="mock-table" />),
}));

// 2. Setup mock domain data
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
    // Notice Bob has no skill logged for Node.js
  ],
};

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("SkillMatrixTable", () => {
  it("renders the table without crashing", () => {
    render(<SkillMatrixTable data={mockData} />);
    
    expect(screen.getByTestId("mock-table")).toBeDefined();
  });

  it("flattens the complex data and passes the correct props to the Table", () => {
    render(<SkillMatrixTable data={mockData} />);

    // Get the exact props passed to our mocked Table component
    const tableProps = vi.mocked(Table).mock.calls[0][0];

    // Verify Headers
    expect(tableProps.headers).toEqual(["User / Topic", "React", "Node.js"]);

    // Verify Keys
    expect(tableProps.keys).toEqual(["name", "t1", "t2"]);

    // Verify Data flattening logic (Rows)
    expect(tableProps.data).toEqual([
      { 
        id: "u1", 
        name: "Alice", 
        t1: 80, 
        t2: 40 
      },
      { 
        id: "u2", 
        name: "Bob", 
        t1: 90, 
        t2: "" // Missing skills should default to an empty string
      },
    ]);
  });

  it("provides a cellRenderer that correctly renders user names and skill values", () => {
    render(<SkillMatrixTable data={mockData} />);
    const tableProps = vi.mocked(Table).mock.calls[0][0];

    // Tell TypeScript we expect this to be defined so it stops complaining
    expect(tableProps.cellRenderer).toBeDefined();
    
    // Use the non-null assertion (!) now that we've guaranteed it exists
    const renderCell = tableProps.cellRenderer!;

    // Create a dummy row to satisfy the 3rd argument requirement
    const dummyRow = { id: "u1", name: "Alice", t1: 80 };

    // Render the output of the custom cellRenderer for a Name
    const nameCell = renderCell("Alice", "name", dummyRow);
    const { container: nameContainer } = render(nameCell as React.ReactElement);
    expect(nameContainer.textContent).toBe("Alice");

    // Render the output of the custom cellRenderer for a Skill value
    const skillCell = renderCell(80, "t1", dummyRow);
    const { container: skillContainer } = render(skillCell as React.ReactElement);
    expect(skillContainer.textContent).toBe("80");
  });
});