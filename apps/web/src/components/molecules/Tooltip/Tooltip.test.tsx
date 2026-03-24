import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

afterEach(() => {
  cleanup();
});

describe("Tooltip", () => {
  it("shows tooltip on mouse enter and hides on mouse leave", () => {
    render(
      <Tooltip content="Tooltip content">
        <span>Trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Trigger").parentElement as HTMLElement;

    expect(screen.queryByRole("tooltip")).toBeNull();

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).not.toBeNull();
    expect(screen.getByText("Tooltip content")).not.toBeNull();

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows on focus and hides on blur", () => {
    render(
      <Tooltip content="Keyboard tooltip">
        <span>Focus target</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Focus target")
      .parentElement as HTMLElement;

    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).not.toBeNull();

    fireEvent.blur(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("does not show when disabled", () => {
    render(
      <Tooltip content="Hidden tooltip" disabled>
        <span>Disabled trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Disabled trigger")
      .parentElement as HTMLElement;

    fireEvent.mouseEnter(trigger);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("applies custom class and passes extra attributes to tooltip panel", () => {
    render(
      <Tooltip
        content="Styled tooltip"
        className="custom-tooltip"
        data-testid="tooltip-panel-custom"
      >
        <span>Styled trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Styled trigger")
      .parentElement as HTMLElement;
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByTestId("tooltip-panel-custom");
    expect(tooltip.className).toContain("custom-tooltip");
    expect(tooltip.getAttribute("role")).toBe("tooltip");
  });

  it("computes and renders position for bottom, left, and right placements", () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function getRect(this: HTMLElement) {
        if ((this as HTMLElement).getAttribute("role") === "tooltip") {
          return {
            x: 0,
            y: 0,
            width: 40,
            height: 20,
            top: 0,
            left: 0,
            right: 40,
            bottom: 20,
            toJSON: () => ({}),
          } as DOMRect;
        }

        return {
          x: 0,
          y: 0,
          width: 50,
          height: 30,
          top: 100,
          left: 200,
          right: 250,
          bottom: 130,
          toJSON: () => ({}),
        } as DOMRect;
      });

    const { rerender } = render(
      <Tooltip content="bottom tip" placement="bottom">
        <span>Placement trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Placement trigger")
      .parentElement as HTMLElement;

    fireEvent.mouseEnter(trigger);
    let tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.top).toBe("138px");
    expect(tooltip.style.left).toBe("205px");

    fireEvent.mouseLeave(trigger);

    rerender(
      <Tooltip content="left tip" placement="left">
        <span>Placement trigger</span>
      </Tooltip>,
    );
    fireEvent.mouseEnter(
      screen.getByText("Placement trigger").parentElement as HTMLElement,
    );
    tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.top).toBe("105px");
    expect(tooltip.style.left).toBe("152px");

    fireEvent.mouseLeave(
      screen.getByText("Placement trigger").parentElement as HTMLElement,
    );

    rerender(
      <Tooltip content="right tip" placement="right">
        <span>Placement trigger</span>
      </Tooltip>,
    );
    fireEvent.mouseEnter(
      screen.getByText("Placement trigger").parentElement as HTMLElement,
    );
    tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.top).toBe("105px");
    expect(tooltip.style.left).toBe("258px");

    rectSpy.mockRestore();
  });

  it("clamps negative coordinates to zero", () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function getRect(this: HTMLElement) {
        if ((this as HTMLElement).getAttribute("role") === "tooltip") {
          return {
            x: 0,
            y: 0,
            width: 100,
            height: 60,
            top: 0,
            left: 0,
            right: 100,
            bottom: 60,
            toJSON: () => ({}),
          } as DOMRect;
        }

        return {
          x: 0,
          y: 0,
          width: 20,
          height: 10,
          top: 10,
          left: 10,
          right: 30,
          bottom: 20,
          toJSON: () => ({}),
        } as DOMRect;
      });

    render(
      <Tooltip content="Top clamp" placement="top" offset={20}>
        <span>Clamp trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Clamp trigger")
      .parentElement as HTMLElement;
    fireEvent.mouseEnter(trigger);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.style.top).toBe("0px");
    expect(tooltip.style.left).toBe("0px");

    rectSpy.mockRestore();
  });

  it("handles resize safely while tooltip is being hidden", () => {
    render(
      <Tooltip content="Resize tip">
        <span>Portal trigger</span>
      </Tooltip>,
    );

    const trigger = screen.getByText("Portal trigger")
      .parentElement as HTMLElement;
    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole("tooltip")).not.toBeNull();

    fireEvent.mouseLeave(trigger);
    fireEvent(window, new Event("resize"));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
