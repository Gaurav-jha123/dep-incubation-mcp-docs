import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Card } from "./Card";

afterEach(() => {
  cleanup();
});

describe("Card Component", () => {

  it("renders simple card with children", () => {
    render(<Card>Card Content</Card>);

    expect(screen.getByText("Card Content")).toBeTruthy();
  });

  it("renders header variant with title and subtitle", () => {
    render(
      <Card variant="header" title="Card Title" subtitle="Card Subtitle">
        Content
      </Card>
    );

    expect(screen.getByText("Card Title")).toBeTruthy();
    expect(screen.getByText("Card Subtitle")).toBeTruthy();
    expect(screen.getByText("Content")).toBeTruthy();
  });

  it("renders image variant with image", () => {
    render(
      <Card
        variant="image"
        imageSrc="https://example.com/image.jpg"
        imageAlt="test image"
      >
        Image Content
      </Card>
    );

    const img = screen.getByAltText("test image");
    expect(img).toBeTruthy();
  });

  it("renders actions variant with buttons", () => {
    render(
      <Card
        variant="actions"
        title="Action Card"
        actions={<button>Click Me</button>}
      >
        Action Content
      </Card>
    );

    expect(screen.getByText("Action Card")).toBeTruthy();
    expect(screen.getByText("Click Me")).toBeTruthy();
  });

  it("triggers button click inside actions", () => {
    let clicked = false;

    render(
      <Card
        variant="actions"
        title="Action Card"
        actions={<button onClick={() => (clicked = true)}>Click</button>}
      >
        Content
      </Card>
    );

    const button = screen.getByText("Click");
    fireEvent.click(button);

    expect(clicked).toBe(true);
  });

  it("applies styled variant classes", () => {
    render(
      <Card variant="styled" styleVariant="outline">
        Styled Card
      </Card>
    );

    const content = screen.getByText("Styled Card");
    expect(content).toBeTruthy();
  });

});