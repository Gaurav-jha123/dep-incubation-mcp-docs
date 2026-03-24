import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Textarea } from "./Textarea";

afterEach(() => {
  cleanup();
});

describe("Textarea Component", () => {
  it("renders textarea", () => {
    render(<Textarea />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeTruthy();
    expect(textarea.className.includes("border-neutral-500")).toBe(true);
  });

  it("renders label", () => {
    render(<Textarea label="Message" />);

    expect(screen.getByText("Message")).toBeTruthy();
  });

  it("renders helper text", () => {
    render(
      <Textarea label="Description" helperText="Maximum 500 characters" />,
    );

    const helperText = screen.getByText("Maximum 500 characters");

    expect(helperText).toBeTruthy();
  });

  it("renders error message", () => {
    render(<Textarea label="Description" error="Description is required" />);

    const errorText = screen.getByText("Description is required");

    expect(errorText).toBeTruthy();
  });

  it.each([
    ["default", "border-neutral-500"],
    ["success", "border-success-500"],
    ["filled", "shadow-inner"],
    ["error", "border-danger-500"],
  ] as const)("applies %s variant styles", (variant, expectedClass) => {
    render(<Textarea variant={variant} />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea.className.includes(expectedClass)).toBe(true);
  });

  it("allows typing", async () => {
    const user = userEvent.setup();

    render(<Textarea />);

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;

    await user.type(textarea, "Hello world");

    expect(textarea.value).toBe("Hello world");
  });

  it("should be disabled", () => {
    render(<Textarea disabled />);

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;

    expect(textarea.disabled).toBe(true);
  });

  it("supports pseudo state previews", () => {
    render(<Textarea pseudoState="focus-visible" />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea.getAttribute("data-pseudo-state")).toBe("focus-visible");
  });

  it("disables the textarea for disabled pseudo state previews", () => {
    render(<Textarea pseudoState="disabled" />);

    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement;

    expect(textarea.disabled).toBe(true);
    expect(textarea.getAttribute("data-pseudo-state")).toBe("disabled");
  });

  it("shows required indicator", () => {
    render(<Textarea label="Comment" required />);

    const requiredIndicator = screen.getByText("*");

    expect(requiredIndicator).not.toBeNull();
  });

  it("renders with default rows", () => {
    render(<Textarea />);

    const textarea = screen.getByTestId("textarea");

    expect(textarea.getAttribute("rows")).toBe("3");
  });
});
