import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import Layout from "../Layout";

vi.mock("../Sidebar", () => ({
  __esModule: true,
  default: ({ onClose, onToggleCollapse }: { onClose?: () => void; onToggleCollapse?: () => void }) => (
    <div>
      <button type="button" data-testid="sidebar" onClick={onClose}>
        Sidebar
      </button>
      <button data-testid="collapse-toggle" onClick={onToggleCollapse}>
        Toggle Collapse
      </button>
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

  it("toggles sidebar on menu click", async () => {
    const { container } = render(<Layout />);
    
    // Initially no overlay
    let overlay = container.querySelector(".fixed.bg-black\\/50");
    expect(overlay).toBeNull();
    
    // Click menu button to open
    fireEvent.click(screen.getByTestId("header"));
    
    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeTruthy();
    });

    // Click overlay to close
    if (overlay) {
      fireEvent.click(overlay);
    }

    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeNull();
    });
  });

  it("closes sidebar on overlay keydown with Enter or Space", async () => {
    const { container } = render(<Layout />);
    
    // Open sidebar
    fireEvent.click(screen.getByTestId("header"));
    
    await waitFor(() => {
      const overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeTruthy();
    });

    // Test with Enter key
    let overlay: HTMLElement | null = container.querySelector(".fixed.bg-black\\/50") as HTMLElement;
    if (overlay) {
      fireEvent.keyDown(overlay, { key: "Enter" });
    }

    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeNull();
    });

    // Open again and test Space key
    fireEvent.click(screen.getByTestId("header"));
    
    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeTruthy();
    });

    overlay = container.querySelector(".fixed.bg-black\\/50");
    if (overlay) {
      fireEvent.keyDown(overlay, { key: " " });
    }

    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeNull();
    });

    // Open and test with non-matching key (should not close)
    fireEvent.click(screen.getByTestId("header"));
    
    await waitFor(() => {
      overlay = container.querySelector(".fixed.bg-black\\/50");
      expect(overlay).toBeTruthy();
    });

    overlay = container.querySelector(".fixed.bg-black\\/50") as HTMLElement;
    if (overlay) {
      fireEvent.keyDown(overlay, { key: "Escape" });
    }

    // Overlay should still be open
    overlay = container.querySelector(".fixed.bg-black\\/50");
    expect(overlay).toBeTruthy();
  });

  it("has correct classes for layout", () => {
    const { container } = render(<Layout />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("min-h-screen");
    expect(root.className).toContain("flex");
    expect(root.className).toContain("bg-background");
  });

  it("toggles sidebar collapse state", async () => {
    const { container } = render(<Layout />);
    
    // Get sidebar element to check initial class
    let sidebar = container.querySelector("#mobile-sidebar");
    expect(sidebar?.className).toContain("lg:w-[280px]");
    
    // Click collapse toggle
    fireEvent.click(screen.getByTestId("collapse-toggle"));
    
    // After toggle, sidebar should have collapsed width
    await waitFor(() => {
      sidebar = container.querySelector("#mobile-sidebar");
      expect(sidebar?.className).toContain("lg:w-20");
    });
  });
});
