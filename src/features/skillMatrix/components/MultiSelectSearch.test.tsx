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

    it("renders the label with the selected count when items are selected", () => {
      render(
        <MultiSelectSearch
          label="Frameworks"
          options={mockOptions}
          selected={["react", "vue"]}
          onChange={vi.fn()}
        />
      );
      
      expect(screen.getByRole("button", { name: "Frameworks ( 2 )" })).not.toBeNull();
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

      expect(screen.getByText("React")).not.toBeNull();
      expect(screen.getByText("Vue")).not.toBeNull();
      expect(screen.getByText("Angular")).not.toBeNull();
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

      await user.click(screen.getByRole("button", { name: "Frameworks ( 1 )" }));
      await user.click(screen.getByText("Vue"));

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

      await user.click(screen.getByRole("button", { name: "Frameworks ( 2 )" }));
      await user.click(screen.getByText("React"));

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
      expect(screen.getByText("React")).not.toBeNull();
      expect(screen.queryByText("Vue")).toBeNull();
      expect(screen.queryByText("Angular")).toBeNull();
    });
  });
});