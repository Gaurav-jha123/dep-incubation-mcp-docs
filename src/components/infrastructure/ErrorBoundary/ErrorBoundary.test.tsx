import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function ThrowingTestComponent(): never {
  throw new Error("Simulated render failure for ErrorBoundary test");
}

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Safe child</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Safe child")).not.toBeNull();
  });

  it("renders default fallback when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingTestComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).not.toBeNull();
    expect(
      screen.getByText("An unexpected error occurred while rendering this screen."),
    ).not.toBeNull();
    expect(
      screen.queryByText("Simulated render failure for ErrorBoundary test"),
    ).toBeNull();
  });

  it("renders custom fallback when provided", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom fallback UI</div>}>
        <ThrowingTestComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Custom fallback UI")).not.toBeNull();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("shows fallback action buttons when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowingTestComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("button", { name: "Try again" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Reload page" })).not.toBeNull();
  });
});
