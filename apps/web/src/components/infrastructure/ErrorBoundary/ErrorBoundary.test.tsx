import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

let shouldThrow = false;

function ConditionalThrow({ children }: Readonly<{ children: React.ReactNode }>) {
  if (shouldThrow) {
    throw new Error("Simulated render failure for ErrorBoundary test");
  }
  return <>{children}</>;
}

function ThrowingTestComponent(): never {
  throw new Error("Simulated render failure for ErrorBoundary test");
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    shouldThrow = false;
  });

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

  it("recovers and re-renders children when Try again is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ConditionalThrow>
          <div>Recovered child</div>
        </ConditionalThrow>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).not.toBeNull();

    shouldThrow = false;
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Recovered child")).not.toBeNull();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("calls window.location.reload when Reload page is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reloadMock = vi.fn();
    const originalLocation = globalThis.location;
    Object.defineProperty(globalThis, "location", {
      value: { ...originalLocation, reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowingTestComponent />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reload page" }));
    expect(reloadMock).toHaveBeenCalledTimes(1);

    Object.defineProperty(globalThis, "location", {
      value: originalLocation,
      writable: true,
    });
  });
});
