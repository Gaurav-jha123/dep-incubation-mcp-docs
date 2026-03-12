import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import type { ReactNode } from "react";
import { Pagination } from "./Pagination";

const getPaginationWithMockedHeadlessUi = async () => {
  vi.resetModules();

  vi.doMock("@headlessui/react", () => {
    const Menu = ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => <nav className={className}>{children}</nav>;

    Menu.Items = ({
      children,
      className,
    }: {
      children: ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>;

    Menu.Item = ({
      children,
    }: {
      children: ((state: { active: boolean }) => ReactNode) | ReactNode;
    }) => {
      if (typeof children === "function") {
        return (
          <>
            {children({ active: true })}
            {children({ active: false })}
          </>
        );
      }

      return <>{children}</>;
    };

    return { Menu };
  });

  const mod = await import("./Pagination");
  vi.doUnmock("@headlessui/react");
  return mod.Pagination;
};

afterEach(() => {
  cleanup();
});

describe("Pagination Component", () => {
  it("calls onPageChange when next is clicked", () => {
    let page = 1;

    const handlePageChange = (p: number) => {
      page = p;
    };

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByText("Next"));

    expect(page).toBe(2);
  });

  it("calls onPageChange when previous is clicked", () => {
    let page = 2;

    const handlePageChange = (p: number) => {
      page = p;
    };

    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByText("Previous"));

    expect(page).toBe(1);
  });

  it("calls onPageChange when a page number is clicked", () => {
    let page = 1;

    const handlePageChange = (p: number) => {
      page = p;
    };

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    fireEvent.click(screen.getByText("3"));

    expect(page).toBe(3);
  });

  it("renders first/last page buttons and ellipses for large page ranges", () => {
    render(
      <Pagination currentPage={10} totalPages={20} onPageChange={() => {}} />,
    );

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("20")).toBeDefined();
    expect(screen.getAllByText("...").length).toBe(2);
  });

  it("renders last page without trailing dots when only one page is hidden", () => {
    render(
      <Pagination currentPage={3} totalPages={6} onPageChange={() => {}} />,
    );

    expect(screen.getByText("6")).toBeDefined();
    expect(screen.queryByText("...")).toBeNull();
  });

  it("adjusts window near end when visible pages are fewer than max", () => {
    render(
      <Pagination currentPage={5} totalPages={6} onPageChange={() => {}} />,
    );

    expect(screen.getByText("2")).toBeDefined();
    expect(screen.getByText("6")).toBeDefined();
  });

  it("calls onPageChange(1) when explicit first-page button is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={onPageChange}
      />,
    );

    const menuItems = screen.getAllByRole("menuitem");
    fireEvent.click(menuItems[0]);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange(totalPages) when explicit last-page button is clicked", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={10}
        totalPages={20}
        onPageChange={onPageChange}
      />,
    );

    const menuItems = screen.getAllByRole("menuitem");
    fireEvent.click(menuItems[menuItems.length - 1]);

    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("covers guard false path for previous when currentPage is below 1", async () => {
    const MockedPagination = await getPaginationWithMockedHeadlessUi();
    const onPageChange = vi.fn();

    render(
      <MockedPagination
        currentPage={0}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Previous"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("covers guard false path for next when currentPage is above totalPages", async () => {
    const MockedPagination = await getPaginationWithMockedHeadlessUi();
    const onPageChange = vi.fn();

    render(
      <MockedPagination
        currentPage={6}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Next"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("covers active true and false class branches for menu items", async () => {
    const MockedPagination = await getPaginationWithMockedHeadlessUi();

    render(
      <MockedPagination
        currentPage={10}
        totalPages={20}
        onPageChange={() => {}}
      />,
    );

    const allButtons = screen.getAllByRole("button");
    const hasActiveClass = allButtons.some((button) =>
      button.className.includes("bg-gray-100"),
    );
    const hasHoverClass = allButtons.some((button) =>
      button.className.includes("hover:bg-gray-100"),
    );

    expect(hasActiveClass).toBe(true);
    expect(hasHoverClass).toBe(true);
  });
});
