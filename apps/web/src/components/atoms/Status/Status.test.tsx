import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Status } from "./Status";

describe("Status", () => {
  it("renders success status with green color and bold font", () => {
    const { container, getByText } = render(<Status status="success" />);
    const span = container.querySelector("span");
    expect(getByText("Success")).toBeDefined();
    expect(span?.style.color).toBe("green");
    expect(span?.style.fontWeight).toBe("bold");
  });

  it("renders error status with red color and bold font", () => {
    const { container, getByText } = render(<Status status="error" />);
    const span = container.querySelector("span");
    expect(getByText("Error")).toBeDefined();
    expect(span?.style.color).toBe("red");
    expect(span?.style.fontWeight).toBe("bold");
  });
});
