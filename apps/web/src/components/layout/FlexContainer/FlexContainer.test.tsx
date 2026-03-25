import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FlexContainer } from "./FlexContainer";

describe("FlexContainer Component", () => {

  it("renders children correctly ", () => {
    render(
      <FlexContainer>
        <div>Child 1</div>
        <div>Child 2</div>
      </FlexContainer>
    );

    const child1 = screen.getByText("Child 1");
    const child2 = screen.getByText("Child 2");

    expect(child1).toBeTruthy();
    expect(child2).toBeTruthy();
  });

  it("applies row direction by default", () => {
    const { container } = render(
      <FlexContainer>
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("flex-row")).toBe(true);
  });

  it("applies column direction when direction='col'", () => {
    const { container } = render(
      <FlexContainer direction="col">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("flex-col")).toBe(true);
  });

  it("applies justify and align classes", () => {
    const { container } = render(
      <FlexContainer justify="center" align="center">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("justify-center")).toBe(true);
    expect(div.className.includes("items-center")).toBe(true);
  });

  it("applies wrap class", () => {
    const { container } = render(
      <FlexContainer wrap="wrap">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("flex-wrap")).toBe(true);
  });

  it("applies full width when fullWidth is true", () => {
    const { container } = render(
      <FlexContainer fullWidth>
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("w-full")).toBe(true);
  });

  it("applies numeric gap correctly", () => {
    const { container } = render(
      <FlexContainer gap={4}>
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.style.gap).toBe("1rem");
  });

  it("applies string gap correctly", () => {
    const { container } = render(
      <FlexContainer gap="10px">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.style.gap).toBe("10px");
  });

  it("applies custom className", () => {
    const { container } = render(
      <FlexContainer className="custom-class">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("custom-class")).toBe(true);
  });

  it("applies decorative variant styles", () => {
    const { container } = render(
      <FlexContainer variant="outline">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.className.includes("border-neutral-200")).toBe(true);
  });

  it("supports pseudo state previews", () => {
    const { container } = render(
      <FlexContainer pseudoState="focus">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.getAttribute("data-pseudo-state")).toBe("focus");
  });

  it("marks disabled pseudo state previews as aria-disabled", () => {
    const { container } = render(
      <FlexContainer pseudoState="disabled">
        <div>Item</div>
      </FlexContainer>
    );

    const div = container.firstChild as HTMLElement;

    expect(div.getAttribute("aria-disabled")).toBe("true");
  });

});