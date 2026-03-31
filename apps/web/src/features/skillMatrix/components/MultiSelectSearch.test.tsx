import {
  describe,
  it,
  expect,
  vi,
  afterEach,
  beforeAll,
  afterAll,
} from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectSearch from "./MultiSelectSearch";

// ---- Local ResizeObserver mock ----
beforeAll(() => {
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    writable: true,
    value: ResizeObserverMock,
  });
});

afterAll(() => {
  Reflect.deleteProperty(globalThis, "ResizeObserver");
});

const opts = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

const noop = vi.fn();

type RenderOpts = {
  enableAdd?: boolean;
  selected?: string[];
  onChange?: (value: string[]) => void;
  onCreateOption?: (label: string) => void;
};

function renderComponent(
  { selected = [], onChange, onCreateOption, enableAdd }: RenderOpts = {
    enableAdd: true,
  },
) {
  return render(
    <MultiSelectSearch
      label="Frameworks"
      options={opts}
      selected={selected}
      onChange={onChange ?? noop}
      onCreateOption={onCreateOption}
      enableAdd={enableAdd}
    />,
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("MultiSelectSearch", () => {
  it("renders button text based on selection and shows/hides Add button", () => {
    const { unmount } = renderComponent({ enableAdd: true });
    expect(
      screen.getByRole("button", { name: /select frameworks/i }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
    unmount();

    renderComponent({
      selected: ["react", "vue"],
      onCreateOption: vi.fn(),
      enableAdd: true,
    });
    expect(screen.getByText("Frameworks")).toBeDefined();
    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByRole("button", { name: "Add" })).toBeDefined();
  });

  it("opens popover, displays options with checkboxes, and toggles selection", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComponent({ selected: ["react"], onChange });

    // Open dropdown
    await user.click(screen.getByRole("button", { name: /frameworks/i }));

    // Check that options are displayed
    expect(screen.getByText("React")).toBeDefined();
    expect(screen.getByText("Vue")).toBeDefined();
    expect(screen.getByLabelText("React")).toBeDefined();
    expect(screen.getByLabelText("Vue")).toBeDefined();
    expect(screen.getByLabelText("Angular")).toBeDefined();

    // Toggle Vue
    await user.click(screen.getByLabelText("Vue"));
    expect(onChange).toHaveBeenCalledWith(["react", "vue"]);

    // Toggle React
    onChange.mockClear();
    await user.click(screen.getByLabelText("React"));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("supports focus navigation without accidental toggles", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderComponent({ onChange });

    await user.click(screen.getByRole("button", { name: /frameworks/i }));

    const vueCheckbox = screen.getByLabelText("Vue");
    vueCheckbox.focus();

    await user.keyboard("[Tab]");
    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /frameworks/i }));
    await user.click(screen.getByLabelText("Vue"));
    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });

  it("filters options and shows empty state", async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole("button", { name: /frameworks/i }));
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
    renderComponent({ onCreateOption: onCreateMock, enableAdd: true });

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

  it("add button should be hidden if enableAdd is false", () => {
    renderComponent({ enableAdd: false, onCreateOption: vi.fn() });
    expect(
      screen.queryByRole("button", {
        name: "Add",
      }),
    ).toBeNull();
  });
});
