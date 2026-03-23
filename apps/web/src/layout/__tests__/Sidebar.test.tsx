import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Sidebar from "../Sidebar";
import { MemoryRouter } from "react-router-dom";

describe("Sidebar", () => {
  afterEach(() => cleanup());

  it("renders all menu items", () => {
    const { getByText } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    expect(getByText("Dashboard")).not.toBeNull();
    expect(getByText("SkillMatrix")).not.toBeNull();
    expect(getByText("Reports")).not.toBeNull();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <Sidebar onClose={onClose} />
      </MemoryRouter>,
    );
    fireEvent.click(getByTestId("close-sidebar"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when a menu item is clicked", () => {
    const onClose = vi.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <Sidebar onClose={onClose} />
      </MemoryRouter>,
    );
    fireEvent.click(getByTestId("navlink-/dashboard"));
    expect(onClose).toHaveBeenCalled();
  });

  it("has correct classes for layout", () => {
    const { container } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );
    const aside = container.firstChild as HTMLElement;
    expect(aside.tagName).toBe("ASIDE");
    expect(aside).toBeDefined();
  });

  it("renders collapsed state correctly", () => {
    const onToggleCollapse = vi.fn();
    const { queryByText, getByLabelText } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={true} onToggleCollapse={onToggleCollapse} />
      </MemoryRouter>,
    );
    expect(queryByText("Skill Matrix")).toBeNull();
    expect(queryByText("Dashboard")).toBeNull();
    const toggleBtn = getByLabelText("Expand sidebar");
    expect(toggleBtn).not.toBeNull();
    fireEvent.click(toggleBtn);
    expect(onToggleCollapse).toHaveBeenCalled();
  });

  it("renders expanded state with toggle button", () => {
    const onToggleCollapse = vi.fn();
    const { getByText, getByLabelText } = render(
      <MemoryRouter>
        <Sidebar isCollapsed={false} onToggleCollapse={onToggleCollapse} />
      </MemoryRouter>,
    );
    expect(getByText("Skill Matrix")).not.toBeNull();
    const toggleBtn = getByLabelText("Collapse sidebar");
    expect(toggleBtn).not.toBeNull();
    fireEvent.click(toggleBtn);
    expect(onToggleCollapse).toHaveBeenCalled();
  });

  it("highlights active nav link", () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Sidebar />
      </MemoryRouter>,
    );
    const activeLink = getByTestId("navlink-/dashboard");
    expect(activeLink.getAttribute("aria-label")).toBe("Dashboard");
    const inactiveLink = getByTestId("navlink-/reports");
    expect(inactiveLink.getAttribute("aria-label")).toBe("Reports");
  });
});
 