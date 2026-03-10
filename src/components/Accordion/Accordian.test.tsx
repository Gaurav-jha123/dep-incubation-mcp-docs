import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Accordion } from "./Accordion";

afterEach(() => {
  cleanup();
});

describe("Accordion Component", () => {
  const items = [
    { title: "Question 1", content: "Answer 1" },
    { title: "Question 2", content: "Answer 2" },
  ];

  it("renders accordion titles", () => {
    render(<Accordion items={items} />);

    expect(screen.getByText("Question 1")).toBeDefined();
    expect(screen.getByText("Question 2")).toBeDefined();
  });

  it("opens accordion panel when clicked", () => {
    render(<Accordion items={items} />);

    const button = screen.getByText("Question 1");
    fireEvent.click(button);

    expect(screen.getByText("Answer 1")).toBeDefined();
  });

  it("toggles accordion panel on click", () => {
    render(<Accordion items={items} />);

    const button = screen.getByText("Question 1");

    fireEvent.click(button);
    expect(screen.getByText("Answer 1")).toBeDefined();

    fireEvent.click(button);
  });
});