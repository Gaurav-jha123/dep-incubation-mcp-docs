import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Table } from "./Table";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

type Person = {
  name: string;
  role: string;
};

const headers = ["Name", "Role"];
const keys: (keyof Person)[] = ["name", "role"];
const data: Person[] = [
  { name: "Zoe", role: "QA" },
  { name: "Arun", role: "Developer" },
  { name: "Mia", role: "Designer" },
  { name: "Ben", role: "Manager" },
  { name: "Lia", role: "Developer" },
  { name: "Noah", role: "Architect" },
];

afterEach(() => {
  cleanup();
});

describe("Table", () => {
  it("renders headers, initial rows, and pagination text", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    expect(screen.getByText("Name")).not.toBeNull();
    expect(screen.getByText("Role")).not.toBeNull();

    expect(screen.getByText("Zoe")).not.toBeNull();
    expect(screen.getByText("Lia")).not.toBeNull();
    expect(screen.queryByText("Noah")).toBeNull();

    expect(screen.getByText("Page 1 of 2")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Previous" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  it("moves between pages with next and previous buttons", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).not.toBeNull();
    expect(screen.getByText("Noah")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Next" }).hasAttribute("disabled"),
    ).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByText("Page 1 of 2")).not.toBeNull();
  });

  it("filters rows by search text", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "architect" },
    });

    expect(screen.getByText("Noah")).not.toBeNull();
    expect(screen.queryByText("Zoe")).toBeNull();
  });

  it("shows no data message when search has no matches", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "non-existent-value" },
    });

    expect(screen.getByText("No data found")).not.toBeNull();
  });

  it("sorts by selected column and toggles sort direction", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.click(screen.getByText("Name"));

    const rowsAfterAscSort = screen.getAllByRole("row");
    expect(rowsAfterAscSort[1].textContent).toContain("Arun");
    expect(screen.getByText("▲")).not.toBeNull();

    fireEvent.click(screen.getByText("Name"));

    const rowsAfterDescSort = screen.getAllByRole("row");
    expect(rowsAfterDescSort[1].textContent).toContain("Zoe");
    expect(screen.getByText("▼")).not.toBeNull();

    fireEvent.click(screen.getByText("Name"));
    expect(screen.getByText("▲")).not.toBeNull();
  });

  it("updates rows per page from listbox options", () => {
    render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        rowsPerPageOptions={[2, 4, 10]}
      />,
    );

    expect(screen.getByText("Page 1 of 3")).not.toBeNull();

    const listboxButton = screen.getByRole("button", { name: "Rows: 2" });
    fireEvent.click(listboxButton);

    const option10 = screen.getByRole("option", { name: "10" });
    fireEvent.pointerEnter(option10);
    fireEvent.pointerMove(option10);

    fireEvent.click(option10);

    expect(screen.getByRole("button", { name: "Rows: 10" })).not.toBeNull();
    expect(screen.getByText("Page 1 of 1")).not.toBeNull();
  });

  it("applies custom container className", () => {
    const { container } = render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        className="table-custom"
      />,
    );

    expect(container.firstChild).not.toBeNull();
    expect((container.firstChild as HTMLElement).className).toContain(
      "table-custom",
    );
  });

  it("resets to first page when search input changes", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 2")).not.toBeNull();

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "zoe" },
    });

    expect(screen.getByText("Page 1 of 1")).not.toBeNull();
    expect(screen.getByText("Zoe")).not.toBeNull();
  });

  it("hides search input when showSearch is false", () => {
    render(
      <Table headers={headers} data={data} keys={keys} showSearch={false} />,
    );

    expect(screen.queryByPlaceholderText("Search...")).toBeNull();
  });

  it("hides rows-per-page listbox when only one option is provided", () => {
    render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        rowsPerPageOptions={[5]}
      />,
    );

    expect(screen.queryByRole("button", { name: /Rows:/ })).toBeNull();
  });

  it("applies sticky header and sticky first column classes", () => {
    render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        stickyHeader
        stickyFirstColumn
      />,
    );

    const nameHeaderCell = screen
      .getByText("Name")
      .closest("th") as HTMLElement;
    const firstDataCell = screen.getByText("Zoe").closest("td") as HTMLElement;

    expect(nameHeaderCell.className).toContain("sticky");
    expect(nameHeaderCell.className).toContain("left-0");
    expect(firstDataCell.className).toContain("sticky");
    expect(firstDataCell.className).toContain("left-0");
  });

  it("renders cell content using cellRenderer when provided", () => {
    render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        cellRenderer={(value, key) =>
          key === "role" ? (
            <strong>{`ROLE:${String(value)}`}</strong>
          ) : (
            String(value)
          )
        }
      />,
    );

    expect(screen.getByText("ROLE:QA")).not.toBeNull();
  });

  it("applies expected style classes to header and row elements", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    const thead = screen.getByText("Name").closest("thead") as HTMLElement;
    const nameHeaderCell = screen
      .getByText("Name")
      .closest("th") as HTMLElement;
    const firstRow = screen.getByText("Zoe").closest("tr") as HTMLElement;

    expect(thead.className).toContain("bg-neutral-200");
    expect(thead.className).toContain("text-neutral-700");
    expect(nameHeaderCell.className).toContain("bg-neutral-50");
    expect(nameHeaderCell.className).toContain("cursor-pointer");
    expect(firstRow.className).toContain("hover:bg-neutral-50");
  });

  it("applies sticky first-column background style when enabled", () => {
    render(
      <Table headers={headers} data={data} keys={keys} stickyFirstColumn />,
    );

    const firstDataCell = screen.getByText("Zoe").closest("td") as HTMLElement;
    expect(firstDataCell.className).toContain("sticky");
    expect(firstDataCell.className).toContain("left-0");
    expect(firstDataCell.className).toContain("bg-primary-50");
  });

  it("resets rowsPerPage and page when rowsPerPageOptions default changes", () => {
    const { rerender } = render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        rowsPerPageOptions={[2, 5, 10]}
      />,
    );

    expect(screen.getByText("Page 1 of 3")).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Page 2 of 3")).not.toBeNull();

    rerender(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        rowsPerPageOptions={[3, 5, 10]}
      />,
    );

    expect(screen.getByText("Page 1 of 2")).not.toBeNull();
  });

  it("sorts numeric values numerically rather than lexicographically", () => {
    type NumRow = { label: string; count: number };
    const numHeaders = ["Label", "Count"];
    const numKeys: (keyof NumRow)[] = ["label", "count"];
    const numData: NumRow[] = [
      { label: "A", count: 20 },
      { label: "B", count: 3 },
      { label: "C", count: 100 },
    ];

    render(<Table headers={numHeaders} data={numData} keys={numKeys} />);

    fireEvent.click(screen.getByText("Count"));

    const rowsAsc = screen.getAllByRole("row");
    expect(rowsAsc[1].textContent).toContain("3");
    expect(rowsAsc[2].textContent).toContain("20");
    expect(rowsAsc[3].textContent).toContain("100");

    fireEvent.click(screen.getByText("Count"));

    const rowsDesc = screen.getAllByRole("row");
    expect(rowsDesc[1].textContent).toContain("100");
    expect(rowsDesc[2].textContent).toContain("20");
    expect(rowsDesc[3].textContent).toContain("3");
  });

  it("renders empty string for undefined cell values without cellRenderer", () => {
    type Partial = { name: string; note: string | undefined };
    const partialHeaders = ["Name", "Note"];
    const partialKeys: (keyof Partial)[] = ["name", "note"];
    const partialData: Partial[] = [
      { name: "Alice", note: undefined },
      { name: "Bob", note: "hello" },
    ];

    render(
      <Table headers={partialHeaders} data={partialData} keys={partialKeys} />,
    );

    expect(screen.getByText("Alice")).not.toBeNull();
    expect(screen.getByText("hello")).not.toBeNull();
  });

  it("switches sort to a new column resetting direction to asc", () => {
    render(<Table headers={headers} data={data} keys={keys} />);

    fireEvent.click(screen.getByText("Name"));
    fireEvent.click(screen.getByText("Name"));
    expect(screen.getByText("▼")).not.toBeNull();

    fireEvent.click(screen.getByText("Role"));
    expect(screen.getByText("▲")).not.toBeNull();

    const rows = screen.getAllByRole("row");
    expect(rows[1].textContent).toContain("Architect");
  });

  it("handles sorting with mixed numeric and non-numeric values", () => {
    type MixedRow = { name: string; value: string | number };
    const mixedHeaders = ["Name", "Value"];
    const mixedKeys: (keyof MixedRow)[] = ["name", "value"];
    const mixedData: MixedRow[] = [
      { name: "A", value: "text" },
      { name: "B", value: 5 },
    ];

    render(<Table headers={mixedHeaders} data={mixedData} keys={mixedKeys} />);

    fireEvent.click(screen.getByText("Value"));

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("sorts correctly when data contains null, undefined, and empty string values", () => {
    type NullableRow = Record<string, unknown>;
    const nullHeaders = ["Name", "Score"];
    const nullKeys: (keyof NullableRow)[] = ["name", "score"];
    const nullData: NullableRow[] = [
      { name: "A", score: null },
      { name: "B", score: "" },
      { name: "C", score: undefined },
      { name: "D", score: 10 },
    ];

    render(
      <Table headers={nullHeaders} data={nullData} keys={nullKeys} rowsPerPageOptions={[10]} />,
    );

    fireEvent.click(screen.getByText("Score"));

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(5);
  });

  it("hides both search and rows-per-page controls when not needed", () => {
    render(
      <Table
        headers={headers}
        data={data}
        keys={keys}
        showSearch={false}
        rowsPerPageOptions={[5]}
      />,
    );

    expect(screen.queryByPlaceholderText("Search...")).toBeNull();
    expect(screen.queryByRole("button", { name: /Rows:/ })).toBeNull();
    expect(screen.getByText("Zoe")).not.toBeNull();
  });
});
 