import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Modal } from "./Modal";

afterEach(() => {
  cleanup();
});

describe("Modal Component", () => {
  it("renders modal content when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal Content
      </Modal>
    );

    expect(screen.getByText("Modal Content")).toBeTruthy();
  });

  it("does not render modal when closed", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Hidden Content
      </Modal>
    );

    expect(screen.queryByText("Hidden Content")).toBeNull();
  });

  it("renders title and description", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        title="Test Title"
        description="Test Description"
      >
        Content
      </Modal>
    );

    expect(screen.getByText("Test Title")).toBeTruthy();
    expect(screen.getByText("Test Description")).toBeTruthy();
  });

  it("renders footer content", () => {
    render(
      <Modal
        isOpen={true}
        onClose={() => {}}
        footer={<button>Save</button>}
      >
        Content
      </Modal>
    );

    expect(screen.getByText("Save")).toBeTruthy();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();

    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        showCancelButton
        title="Modal"
      >
        Content
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when showCancelButton is false", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Modal">
        Content
      </Modal>
    );

    expect(screen.queryByLabelText("Close modal")).toBeNull();
  });

  it("applies expected max-width class for each size", () => {
    const sizes = [
      { size: "sm" as const, className: "max-w-sm" },
      { size: "md" as const, className: "max-w-lg" },
      { size: "lg" as const, className: "max-w-2xl" },
      { size: "xl" as const, className: "max-w-4xl" },
    ];

    sizes.forEach(({ size, className }) => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={() => {}} size={size}>
          Sized Modal
        </Modal>
      );

      const content = screen.getByText("Sized Modal");
      const panel = content.closest("[data-pseudo-state], .max-w-sm, .max-w-lg, .max-w-2xl, .max-w-4xl")
        ?? content.closest("div");
      expect(panel?.className).toContain(className);
      unmount();
    });
  });

  it("applies data-pseudo-state when pseudoState is set", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} pseudoState="hover">
        Content
      </Modal>
    );

    const content = screen.getByText("Content");
    const panel = content.closest("[data-pseudo-state]");
    expect(panel?.getAttribute("data-pseudo-state")).toBe("hover");
  });

  it("does not apply data-pseudo-state when pseudoState is none", () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} pseudoState="none">
        Content
      </Modal>
    );

    expect(container.querySelector("[data-pseudo-state]")).toBeNull();
  });

  it("sets aria-disabled and disables close button when pseudoState is disabled", () => {
    const onClose = vi.fn();

    render(
      <Modal
        isOpen={true}
        onClose={onClose}
        pseudoState="disabled"
        showCancelButton
        title="Disabled Modal"
      >
        Content
      </Modal>
    );

    const content = screen.getByText("Content");
    const panel = content.closest("[data-pseudo-state='disabled']");
    const closeButton = screen.getByLabelText("Close modal") as HTMLButtonElement;

    expect(panel?.getAttribute("aria-disabled")).toBe("true");
    expect(closeButton.disabled).toBe(true);

    fireEvent.click(closeButton);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("applies ring classes when pseudoState is focus", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} pseudoState="focus">
        Content
      </Modal>
    );

    const content = screen.getByText("Content");
    const panel = content.closest("[data-pseudo-state='focus']");
    expect(panel?.className).toContain("data-[pseudo-state=focus]:ring-2");
  });

  it("renders different modal sizes", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Large Modal
      </Modal>
    );

    expect(screen.getByText("Large Modal")).toBeTruthy();
  });
});