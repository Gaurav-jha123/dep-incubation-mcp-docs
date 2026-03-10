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

    fireEvent.click(screen.getByRole("button", { name: "Rows: 2" }));
    const option10 = screen.getByRole("option", { name: "10" });
    fireEvent.mouseEnter(option10);
    fireEvent.mouseMove(option10);

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
});
