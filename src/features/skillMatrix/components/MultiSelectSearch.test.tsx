import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MultiSelectSearch from "./MultiSelectSearch";

const mockOptions = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("MultiSelectSearch", () => {
  describe("rendering", () => {
    it("renders the default button text when no items are selected", () => {
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={[]}
          onChange={vi.fn()}
        />
      );
      
      expect(screen.getByRole("button", { name: "Select Frameworks" })).not.toBeNull();
    });

    it("renders the label with count badge when items are selected", () => {
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={["react", "vue"]}
          onChange={vi.fn()}
        />
      );
      
      const button = screen.getByRole("button");
      expect(button).toBeDefined();
      expect(screen.getByText("Frameworks")).toBeDefined();
      expect(screen.getByText("2")).toBeDefined(); // Count badge
    });
  });

  describe("interactions", () => {
    it("opens the popover and displays options when clicked", async () => {
      const user = userEvent.setup();
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={[]}
          onChange={vi.fn()}
        />
      );

      const button = screen.getByRole("button", { name: "Select Frameworks" });
      await user.click(button);

      expect(screen.getByText("React")).toBeDefined();
      expect(screen.getByText("Vue")).toBeDefined();
      expect(screen.getByText("Angular")).toBeDefined();
      
      // Verify checkboxes are present
      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(3);
    });

    it("adds a value to selection when an unselected option is clicked", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={["react"]}
          onChange={onChangeMock}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);
      
      // Click on the Vue option (the div containing the checkbox and label)
      const vueOption = screen.getByText("Vue").closest('div');
      await user.click(vueOption);

      expect(onChangeMock).toHaveBeenCalledWith(["react", "vue"]);
    });

    it("removes a value from selection when an already selected option is clicked", async () => {
      const user = userEvent.setup();
      const onChangeMock = vi.fn();
      
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={["react", "vue"]}
          onChange={onChangeMock}
        />
      );

      const button = screen.getByRole("button");
      await user.click(button);
      
      // Click on the React option (the div containing the checkbox and label)
      const reactOption = screen.getByText("React").closest('div');
      await user.click(reactOption);

      expect(onChangeMock).toHaveBeenCalledWith(["vue"]);
    });
  });

  describe("filtering", () => {
    it("filters the visible options based on the search query", async () => {
      const user = userEvent.setup();
      
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={[]}
          onChange={vi.fn()}
        />
      );

      await user.click(screen.getByRole("button", { name: "Select Frameworks" }));
      
      const searchInput = screen.getByPlaceholderText("Search Frameworks");
      await user.type(searchInput, "re");

      // "React" matches, "Vue" and "Angular" do not
      expect(screen.getByText("React")).toBeDefined();
      expect(screen.queryByText("Vue")).toBeNull();
      expect(screen.queryByText("Angular")).toBeNull();
    });

    it("shows 'No items found' message when no options match search", async () => {
      const user = userEvent.setup();
      
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={[]}  
          onChange={vi.fn()}
        />
      );

      await user.click(screen.getByRole("button", { name: "Select Frameworks" }));
      
      const searchInput = screen.getByPlaceholderText("Search Frameworks");
      await user.type(searchInput, "nonexistent");

      expect(screen.getByText("No items found.")).toBeDefined();
    });
  });
});