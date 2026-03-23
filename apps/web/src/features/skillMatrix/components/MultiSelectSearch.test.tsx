import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectSearch from "./MultiSelectSearch";

const opts = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

const noop = vi.fn();

type RenderOpts = {
  selected?: string[];
  onChange?: (value: string[]) => void;
  onCreateOption?: (label: string) => void;
};

function renderComponent({ selected = [], onChange, onCreateOption }: RenderOpts = {}) {
  return render(
    <MultiSelectSearch
      label="Frameworks"
      options={opts}
      selected={selected}
      onChange={onChange ?? noop}
      onCreateOption={onCreateOption}
    />
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("MultiSelectSearch", () => {
  it("renders button text based on selection and shows/hides Add button", () => {
    const { unmount } = renderComponent();
    expect(screen.getByRole("button", { name: "Select Frameworks" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
    unmount();

    renderComponent({ selected: ["react", "vue"], onCreateOption: vi.fn() });
    expect(screen.getByText("Frameworks")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
  });

  it("opens popover, displays options with checkboxes, and toggles selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComponent({ selected: ["react"], onChange });

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Vue")).toBeDefined();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);

    await user.click(screen.getByText("Vue").closest("div")!);
    expect(onChange).toHaveBeenCalledWith(["react", "vue"]);

    onChange.mockClear();
    await user.click(screen.getByText("React").closest("div")!);
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("handles keyboard interaction on option rows (Enter, Space, other)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComponent({ onChange });

    await user.click(screen.getByRole("button", { name: "Select Frameworks" }));
    const vueRow = screen.getByText("Vue").closest("[role='button']")!;

    fireEvent.keyDown(vueRow, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith(["vue"]);

    onChange.mockClear();
    fireEvent.keyDown(vueRow, { key: " " });
    expect(onChange).toHaveBeenCalled();

    onChange.mockClear();
    fireEvent.keyDown(vueRow, { key: "Tab" });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("filters options and shows empty state", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: "Select Frameworks" }));
    const input = screen.getByPlaceholderText("Search Frameworks");

    await user.type(input, "re");
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.queryByText("Vue")).toBeNull();

    await user.clear(input);
    await user.type(input, "nonexistent");
    expect(screen.getByText("No items found.")).toBeDefined();
  });

  it("add form: toggle, save validations, successful create, cancel, and keyboard shortcuts", async () => {
    const user = userEvent.setup();
    const onCreateMock = vi.fn();
    renderComponent({ onCreateOption: onCreateMock });

    // Toggle form on/off
    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.getByPlaceholderText("Add Framework")).toBeDefined();
    expect(screen.getByRole("button", { name: "Save" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDefined();

    await user.click(screen.getByRole("button", { name: "Add" }));
    expect(screen.queryByPlaceholderText("Add Framework")).toBeNull();

    // Empty save → error → typing clears error
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Framework name is required.")).toBeDefined();
    await user.type(screen.getByPlaceholderText("Add Framework"), "S");
    expect(screen.queryByText("Framework name is required.")).toBeNull();

    // Duplicate save
    await user.clear(screen.getByPlaceholderText("Add Framework"));
    await user.type(screen.getByPlaceholderText("Add Framework"), "React");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getByText("Framework already exists.")).toBeDefined();

    // Successful save
    await user.clear(screen.getByPlaceholderText("Add Framework"));
    await user.type(screen.getByPlaceholderText("Add Framework"), "Svelte");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onCreateMock).toHaveBeenCalledWith("Svelte");
    expect(screen.queryByPlaceholderText("Add Framework")).toBeNull();

    // Enter key submits
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByPlaceholderText("Add Framework"), "Solid");
    await user.keyboard("{Enter}");
    expect(onCreateMock).toHaveBeenCalledWith("Solid");

    // Escape key cancels
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByPlaceholderText("Add Framework"), "X");
    await user.keyboard("{Escape}");
    expect(screen.queryByPlaceholderText("Add Framework")).toBeNull();

    // Cancel button
    await user.click(screen.getByRole("button", { name: "Add" }));
    await user.type(screen.getByPlaceholderText("Add Framework"), "Y");
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByPlaceholderText("Add Framework")).toBeNull();
  });
});