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

  describe("type variants", () => {
    it.each(["info", "success", "warning", "error"] as const)(
      "renders %s type with correct class",
      (type) => {
        const classMap = {
          info: "border-primary-500",
          success: "border-success-500",
          warning: "border-warning-500",
          error: "border-danger-500",
        };
        render(<Alert message="Typed alert" type={type} />);
        const alert = screen.getByRole("alert");
        expect(alert.className).toContain(classMap[type]);
      },
    );

    it("defaults to info type when type is not provided", () => {
      render(<Alert message="Default type" />);
      expect(screen.getByRole("alert").className).toContain("border-primary-500");
    });
  });

  describe("pseudo-state", () => {
    it("applies data-pseudo-state when pseudoState is set", () => {
      render(<Alert message="Hover state" pseudoState="hover" />);
      expect(
        screen.getByRole("alert").getAttribute("data-pseudo-state"),
      ).toBe("hover");
    });

    it("does not apply data-pseudo-state when pseudoState is none", () => {
      render(<Alert message="Default state" pseudoState="none" />);
      expect(
        screen.getByRole("alert").getAttribute("data-pseudo-state"),
      ).toBeNull();
    });

    it("applies data-pseudo-state for each pseudo-state variant", () => {
      const states = ["hover", "active", "focus", "focus-visible", "disabled"] as const;

      states.forEach((state) => {
        const { unmount } = render(
          <Alert message="State test" pseudoState={state} />,
        );
        expect(
          screen.getByRole("alert").getAttribute("data-pseudo-state"),
        ).toBe(state);
        unmount();
      });
    });

      it("keeps disabled styling on the alert container when pseudoState is disabled", () => {
        render(<Alert message="Disabled state" pseudoState="disabled" />);
        expect(screen.getByRole("alert").className).toContain("data-[pseudo-state=disabled]:opacity-50");
    });

    it("disables close button when pseudoState is disabled", () => {
      render(<Alert message="Disabled" closable pseudoState="disabled" />);
      const closeBtn = screen.getByRole("button", { name: "Close alert" }) as HTMLButtonElement;
      expect(closeBtn.disabled).toBe(true);
    });

    it("does not call onClose when close button clicked with pseudoState disabled", () => {
      const onClose = vi.fn();
      render(
        <Alert message="Disabled" closable pseudoState="disabled" onClose={onClose} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Close alert" }));
      expect(onClose).not.toHaveBeenCalled();
    });

    it("applies data-pseudo-state to close button", () => {
      render(<Alert message="Focus" closable pseudoState="focus" />);
      const closeBtn = screen.getByRole("button", { name: "Close alert" });
      expect(closeBtn.getAttribute("data-pseudo-state")).toBe("focus");
    });
  });

  describe("reactivity", () => {
    it("hides alert when isOpen prop changes to false", async () => {
      const { rerender } = render(<Alert message="Visible" isOpen={true} />);
      expect(screen.getByRole("alert")).not.toBeNull();

      rerender(<Alert message="Visible" isOpen={false} />);

      await waitFor(() => {
        expect(screen.queryByRole("alert")).toBeNull();
      });
    });

    it("applies custom className to alert container", () => {
      render(<Alert message="Styled" className="my-custom-class" />);
      expect(screen.getByRole("alert").className).toContain("my-custom-class");
    });
  });
});
