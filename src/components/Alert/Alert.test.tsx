import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { Alert } from "./Alert";

afterEach(() => {
  cleanup();
});

describe("Alert", () => {
  describe("rendering", () => {
    it("renders alert message", () => {
      render(<Alert message="Test message" />);
      expect(screen.getByRole("alert")).not.toBeNull();
      expect(screen.getByText("Test message")).not.toBeNull();
    });

    it("renders children over message when provided", () => {
      render(
        <Alert message="Fallback message">
          <span>Custom content</span>
        </Alert>,
      );

      expect(screen.getByText("Custom content")).not.toBeNull();
      expect(screen.queryByText("Fallback message")).toBeNull();
    });

    it("does not render when isOpen is false", () => {
      render(<Alert message="Hidden" isOpen={false} />);
      expect(screen.queryByRole("alert")).toBeNull();
    });
  });

  describe("variants", () => {
    it("applies success classes", () => {
      render(<Alert type="success" message="Success" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("border-green-200");
      expect(alert.className).toContain("bg-green-50");
      expect(alert.className).toContain("text-green-800");
    });

    it("applies error classes", () => {
      render(<Alert type="error" message="Error" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("border-red-200");
      expect(alert.className).toContain("bg-red-50");
      expect(alert.className).toContain("text-red-800");
    });

    it("applies warning classes", () => {
      render(<Alert type="warning" message="Warning" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("border-amber-200");
      expect(alert.className).toContain("bg-amber-50");
      expect(alert.className).toContain("text-amber-800");
    });

    it("applies info classes by default", () => {
      render(<Alert message="Info" />);
      const alert = screen.getByRole("alert");
      expect(alert.className).toContain("border-sky-200");
      expect(alert.className).toContain("bg-sky-50");
      expect(alert.className).toContain("text-sky-800");
    });
  });

  describe("close behavior", () => {
    it("does not show close button when closable is false", () => {
      render(<Alert message="No close" />);
      expect(screen.queryByRole("button", { name: "Close alert" })).toBeNull();
    });

    it("shows close button when closable is true", () => {
      render(<Alert message="Closable" closable />);
      expect(
        screen.getByRole("button", { name: "Close alert" }),
      ).not.toBeNull();
    });

    it("calls onClose and hides alert when close button is clicked", async () => {
      const onClose = vi.fn();
      render(<Alert message="Closable" closable onClose={onClose} />);

      fireEvent.click(screen.getByRole("button", { name: "Close alert" }));

      expect(onClose).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(screen.queryByRole("alert")).toBeNull();
      });
    });
  });
});
