import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { List } from "./List";

afterEach(() => {
  cleanup();
});

const mockItems = [
  {
    label: "Item 1",
    description: "Description 1",
  },
  {
    label: "Item 2",
    description: "Description 2",
  },
];

describe("List Component", () => {

  afterEach(() => cleanup());

  it("renders all list items", () => {
    render(<List items={mockItems} />);

    const item1 = screen.getByText("Item 1");
    const item2 = screen.getByText("Item 2");

    expect(item1).toBeTruthy();
    expect(item2).toBeTruthy();
  });

  it("renders item descriptions", () => {
    render(<List items={mockItems} />);

    const desc1 = screen.getAllByText("Description 1")[0];
    const desc2 = screen.getAllByText("Description 2")[0];

    expect(desc1).toBeTruthy();
    expect(desc2).toBeTruthy();
  });

  it("calls onChange when an item is clicked", async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(
    <List items={mockItems} onChange={handleChange} />
  );

  const options = screen.getAllByRole("option");

  await user.click(options[0]);

  expect(handleChange).toHaveBeenCalled();
});

    
it("passes correct item to onChange", async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(
    <List items={mockItems} onChange={handleChange} />
  );

  const options = screen.getAllByRole("option");

  await user.click(options[1]);

    expect(handleChange).toHaveBeenCalledWith(mockItems[1]);
  });

  it("shows checkmark when item is selected", () => {
    render(<List items={mockItems} value={mockItems[0]} />);

    const checkmark = screen.getAllByTestId("selected-icon")[0];

    expect(checkmark).toBeTruthy();
  });

  it("renders icon when provided ", () => {
    const itemsWithIcon = [
      {
        label: "Item with icon",
        icon: <span data-testid="icon">icon</span>,
      },
    ];

    render(<List items={itemsWithIcon} />);

    const icon = screen.getByTestId("icon");

    expect(icon).toBeTruthy();
  });

  it("applies bordered variant styles", () => {
    const { container } = render(<List items={mockItems} variant="bordered" />);

    const listbox = container.querySelector("[aria-label='Selectable items']");

    expect(listbox?.className.includes("border")).toBe(true);
  });

  it("applies custom className", () => {
    const { container } = render(
      <List items={mockItems} className="custom-class" />,
    );

    const listbox = container.querySelector("[aria-label='Selectable items']");

    expect(listbox?.className.includes("custom-class")).toBe(true);
  });
});
