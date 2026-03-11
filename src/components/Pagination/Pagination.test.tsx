import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Pagination } from "./Pagination";

afterEach(() => {
  cleanup();
});

describe("Pagination Component", () => {
  it("renders previous and next buttons", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    expect(screen.getByText("Previous")).toBeDefined();
    expect(screen.getByText("Next")).toBeDefined();
  });

  it("calls onPageChange when next is clicked", () => {
    let page = 1;

    const handlePageChange = (p: number) => {
      page = p;
    };

    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
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
      <Pagination currentPage={2} totalPages={5} onPageChange={handlePageChange} />
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
      <Pagination currentPage={1} totalPages={5} onPageChange={handlePageChange} />
    );

    fireEvent.click(screen.getByText("3"));

    expect(page).toBe(3);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
    );

    const prevButton = screen.getByText("Previous");
    expect((prevButton as HTMLButtonElement).disabled).toBe(true);
  });

  it("disables next button on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />
    );

    const nextButton = screen.getByText("Next");
    expect((nextButton as HTMLButtonElement).disabled).toBe(true);
  });
});