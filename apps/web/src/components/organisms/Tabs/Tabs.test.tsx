import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Tabs } from "./Tabs";

afterEach(() => {
  cleanup();
});

const tabsData = [
  { label: "Tab 1", content: "Content 1" },
  { label: "Tab 2", content: "Content 2" },
  { label: "Tab 3", content: "Content 3" },
];

describe("Tabs Component", () => {

  it("renders all tab labels", () => {
    render(<Tabs tabs={tabsData} />);

    expect(screen.getByText("Tab 1")).toBeTruthy();
    expect(screen.getByText("Tab 2")).toBeTruthy();
    expect(screen.getByText("Tab 3")).toBeTruthy();
  });

  it("shows first tab content by default", () => {
    render(<Tabs tabs={tabsData} />);

    expect(screen.getByText("Content 1")).toBeTruthy();
  });

  it("switches tab content on click", () => {
    render(<Tabs tabs={tabsData} />);

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);

    expect(screen.getByText("Content 2")).toBeTruthy();
  });

  it("does not switch when tab is disabled", () => {
    const disabledTabs = [
      { label: "Tab 1", content: "Content 1" },
      { label: "Tab 2", content: "Content 2", disabled: true },
    ];

    render(<Tabs tabs={disabledTabs} />);

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);

    expect(screen.getByText("Content 1")).toBeTruthy();
  });

  it("renders underline variant correctly", () => {
    render(<Tabs tabs={tabsData} variant="underline" />);

    expect(screen.getByText("Tab 1")).toBeTruthy();
  });

  it("renders solid variant correctly", () => {
    render(<Tabs tabs={tabsData} variant="solid" />);

    expect(screen.getByText("Tab 1")).toBeTruthy();
  });

  it("renders pill variant correctly", () => {
    render(<Tabs tabs={tabsData} variant="pill" />);

    expect(screen.getByText("Tab 1")).toBeTruthy();
  });

  it("renders large size tabs", () => {
    render(<Tabs tabs={tabsData} size="lg" />);

    expect(screen.getByText("Tab 1")).toBeTruthy();
  });

});