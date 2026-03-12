import { describe, it, expect, afterEach } from "vitest";
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
    let closed = false;

    render(
      <Modal
        isOpen={true}
        onClose={() => {
          closed = true;
        }}
        showCancelButton
        title="Modal"
      >
        Content
      </Modal>
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(closed).toBe(true);
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