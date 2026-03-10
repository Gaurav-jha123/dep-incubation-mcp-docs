import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Status } from "./Status";

describe("Status Component", () => {

  it("renders Success when status is success", () => {
    render(<Status status="success" />);

    const element = screen.getAllByText("Success")[0];
    expect(element).not.toBeNull();
  });

  it("renders Error when status is error", () => {
    render(<Status status="error" />);

    const element = screen.getAllByText("Error")[0];
    expect(element).not.toBeNull();
  });

  it("applies green color when status is success", () => {
    render(<Status status="success" />);

    const element = screen.getAllByText("Success")[0];
    expect(element.style.color).toBe("green");
  });

  it("applies red color when status is error", () => {
    render(<Status status="error" />);

    const element = screen.getAllByText("Error")[0];
    expect(element.style.color).toBe("red");
  });

});