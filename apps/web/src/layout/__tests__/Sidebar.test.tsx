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
    expect(getByText("Users")).not.toBeNull();
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
    expect(aside.className).toContain("bg-white");
    expect(aside.className).toContain("flex");
    expect(aside.className).toContain("flex-col");
  });
});
