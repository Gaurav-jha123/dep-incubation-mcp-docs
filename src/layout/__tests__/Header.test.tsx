import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import Header from "../Header";
import { MemoryRouter } from "react-router-dom";

describe("Header", () => {
  it("shows the correct dynamic title based on route", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Header onMenuClick={() => {}} isSidebarOpen={false} />
      </MemoryRouter>,
    );
    expect(getByText(/dashboard/i)).toBeTruthy();
  });

  it("calls onMenuClick when menu button is clicked", () => {
    const onMenuClick = vi.fn();
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Header onMenuClick={onMenuClick} isSidebarOpen={false} />
      </MemoryRouter>,
    );
    const header = container.querySelector("header");
    expect(header).toBeTruthy();
    const menuButton =
      header && header.querySelector('[data-testid="menu-button"]');
    expect(menuButton).toBeTruthy();
    if (menuButton) {
      fireEvent.click(menuButton);
    }
    expect(onMenuClick).toHaveBeenCalledTimes(1);
  });

  it("renders the user profile menu", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Header onMenuClick={() => {}} isSidebarOpen={false} />
      </MemoryRouter>,
    );
    const header = container.querySelector("header");
    expect(header).toBeTruthy();
    const profileMenu =
      header && header.querySelector('[data-testid="profile-menu-root"]');
    expect(profileMenu).toBeTruthy();
  });

  it("applies correct layout classes to header", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Header onMenuClick={() => {}} isSidebarOpen={false} />
      </MemoryRouter>,
    );
    const header = container.firstChild as HTMLElement;
    expect(header.className).toContain("w-full");
    expect(header.className).toContain("bg-white");
    expect(header.className).toContain("flex");
    expect(header.className).toContain("border-b");
  });

  it("shows empty title if route is not found", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/not-a-route"]}>
        <Header onMenuClick={() => {}} isSidebarOpen={false} />
      </MemoryRouter>,
    );
    // Should render an empty h2
    const h2 = container.querySelector("h2");
    expect(h2).toBeTruthy();
    expect(h2?.textContent).toBe("");
  });
});
