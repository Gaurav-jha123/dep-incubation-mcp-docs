import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Toast } from "./Toast";

afterEach(() => {
  cleanup();
});

describe("Toast", () => {
  describe("rendering", () => {
    it("renders the toast with a title", () => {
      render(<Toast title="System Notification" />);
      
      expect(screen.getByRole("alert")).not.toBeNull();
      expect(screen.getByText("System Notification")).not.toBeNull();
    });

    it("renders the description when provided", () => {
      render(
        <Toast 
          title="System Notification" 
          description="A standard message for all dashboard alerts." 
        />
      );
      
      expect(screen.getByText("A standard message for all dashboard alerts.")).not.toBeNull();
    });

    it("does not render a description if none is provided", () => {
      const { container } = render(<Toast title="Title Only" />);
      const paragraph = container.querySelector("p");
      expect(paragraph).toBeNull();
    });
  });

  describe("close behavior", () => {
    it("does not show the close button when onClose is undefined", () => {
      render(<Toast title="No close button" />);
      
      expect(screen.queryByRole("button", { name: "Close toast" })).toBeNull();
    });

    it("shows the close button when onClose is provided", () => {
      render(<Toast title="Closable toast" onClose={() => {}} />);
      
      expect(screen.getByRole("button", { name: "Close toast" })).not.toBeNull();
    });

    it("calls onClose when the close button is clicked", () => {
      const onCloseMock = vi.fn();
      render(<Toast title="Closable toast" onClose={onCloseMock} />);

      const closeButton = screen.getByRole("button", { name: "Close toast" });
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("attributes and styling", () => {
    it("merges custom classNames correctly", () => {
      render(
        <Toast 
          title="Custom Toast" 
          className="my-custom-class" 
          data-testid="custom-toast" 
        />
      );
      
      const toast = screen.getByTestId("custom-toast");
      expect(toast.className).toContain("my-custom-class");
      expect(toast.className).toContain("bg-primary-50");
    });

    it("applies the selected variant classes", () => {
      render(
        <Toast
          title="Warning toast"
          description="Heads up"
          variant="warning"
          data-testid="warning-toast"
        />,
      );

      const toast = screen.getByTestId("warning-toast");
      expect(toast.className).toContain("bg-warning-50");
      expect(toast.className).toContain("border-warning-200");
    });

    it("adds pseudo state data attribute for preview behavior", () => {
      render(
        <Toast
          title="Preview toast"
          pseudoState="hover"
          data-testid="preview-toast"
        />,
      );

      const toast = screen.getByTestId("preview-toast");
      expect(toast.getAttribute("data-pseudo-state")).toBe("hover");
    });

    it("disables the close button when pseudoState is disabled", () => {
      render(
        <Toast
          title="Disabled toast"
          onClose={() => {}}
          pseudoState="disabled"
        />,
      );

      const closeButton = screen.getByRole("button", { name: "Close toast" });
      expect(closeButton.hasAttribute("disabled")).toBe(true);
    });
  });
});