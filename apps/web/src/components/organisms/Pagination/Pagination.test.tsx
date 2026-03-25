import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Pagination } from "./Pagination";

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

    fireEvent.click(screen.getByRole("button", { name: "1" }));

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

    fireEvent.click(screen.getByRole("button", { name: "20" }));

    expect(onPageChange).toHaveBeenCalledWith(20);
  });

  it("does not call onPageChange from previous when currentPage is 1", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Previous"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not call onPageChange from next when currentPage is totalPages", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={onPageChange}
      />,
    );

    fireEvent.click(screen.getByText("Next"));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("applies data-pseudo-state when pseudoState is set", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        pseudoState="hover"
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" }).getAttribute("data-pseudo-state")).toBe("hover");
    expect(screen.getByRole("button", { name: "2" }).getAttribute("data-pseudo-state")).toBe("hover");
    expect(screen.getByRole("button", { name: "Next" }).getAttribute("data-pseudo-state")).toBe("hover");
  });

  it("does not apply data-pseudo-state when pseudoState is none", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        pseudoState="none"
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" }).getAttribute("data-pseudo-state")).toBeNull();
  });

  it("disables interaction when pseudoState is disabled", () => {
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        pseudoState="disabled"
        onPageChange={onPageChange}
      />,
    );

    const previous = screen.getByRole("button", { name: "Previous" }) as HTMLButtonElement;
    const next = screen.getByRole("button", { name: "Next" }) as HTMLButtonElement;
    const pageButton = screen.getByRole("button", { name: "4" }) as HTMLButtonElement;

    expect(previous.disabled).toBe(true);
    expect(next.disabled).toBe(true);
    expect(pageButton.disabled).toBe(true);

    fireEvent.click(previous);
    fireEvent.click(next);
    fireEvent.click(pageButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
