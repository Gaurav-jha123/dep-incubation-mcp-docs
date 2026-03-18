import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Layout from "../Layout";

vi.mock("../Sidebar", () => ({
  __esModule: true,
  default: ({ onClose }: { onClose?: () => void }) => (
    <div data-testid="sidebar" onClick={onClose}>
      Sidebar
    </div>
  ),
}));
vi.mock("../Header", () => ({
  __esModule: true,
  default: ({ onMenuClick }: { onMenuClick: () => void }) => (
    <button data-testid="header" onClick={onMenuClick}>
      Header
    </button>
  ),
}));
vi.mock("react-router-dom", () => ({
  Outlet: () => <div data-testid="outlet">Outlet</div>,
}));

describe("Layout", () => {
  afterEach(() => cleanup());

  it("renders sidebar, header, and outlet", () => {
    render(<Layout />);
    expect(screen.getByTestId("sidebar")).toBeDefined();
    expect(screen.getByTestId("header")).toBeDefined();
    expect(screen.getByTestId("outlet")).toBeDefined();
  });

  it("toggles sidebar on menu click", () => {
    render(<Layout />);
    // Sidebar is hidden by default on mobile
    fireEvent.click(screen.getByTestId("header"));
    // Sidebar overlay should appear
    // Simulate overlay click to close
    fireEvent.click(document.querySelector(".fixed.bg-black\\/50")!);
  });

  it("has correct classes for layout", () => {
    const { container } = render(<Layout />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("min-h-screen");
    expect(root.className).toContain("flex");
    expect(root.className).toContain("bg-gray-50");
  });
});
