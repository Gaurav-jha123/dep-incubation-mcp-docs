import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AvatarGroup } from "./AvatarGroup";

afterEach(() => {
  cleanup();
});

const avatars = [
  { fallback: "A" },
  { fallback: "B" },
  { fallback: "C" },
  { fallback: "D" },
  { fallback: "E" },
  { fallback: "F" },
];

describe("AvatarGroup Component", () => {

  it("renders avatars", () => {
    render(<AvatarGroup avatars={avatars} maxVisible={3} />);

    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
    expect(screen.getByText("C")).toBeTruthy();
  });

  it("limits visible avatars based on maxVisible", () => {
    render(<AvatarGroup avatars={avatars} maxVisible={2} />);

    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("shows remaining avatar count", () => {
    render(<AvatarGroup avatars={avatars} maxVisible={3} />);

    const remaining = screen.getByText("+3");
    expect(remaining).toBeTruthy();
  });

  it("does not show remaining count when avatars within limit", () => {
    render(<AvatarGroup avatars={avatars.slice(0, 3)} maxVisible={5} />);

    const remaining = screen.queryByText("+1");
    expect(remaining).toBeNull();
  });

  it("applies correct size class for lg avatars", () => {
    const { container } = render(
      <AvatarGroup avatars={avatars} size="lg" maxVisible={2} />
    );

    const avatar = container.querySelector(".h-14");
    expect(avatar).toBeTruthy();
  });

  it("renders correct remaining count when maxVisible is small", () => {
    render(<AvatarGroup avatars={avatars} maxVisible={1} />);

    const remaining = screen.getByText("+5");
    expect(remaining).toBeTruthy();
  });
  it("applies correct size class for sm avatars", () => {
  const { container } = render(
    <AvatarGroup avatars={avatars} size="sm" maxVisible={2} />
  );

  const avatar = container.querySelector(".h-8");
  expect(avatar).toBeTruthy();
});

  it("applies correct size class for md avatars", () => {
    const { container } = render(
      <AvatarGroup avatars={avatars} size="md" maxVisible={2} />
    );

    const avatar = container.querySelector(".h-10");
    expect(avatar).toBeTruthy();
  });

  it("applies correct size class for xl avatars", () => {
    const { container } = render(
      <AvatarGroup avatars={avatars} size="xl" maxVisible={2} />
    );

    const avatar = container.querySelector(".h-20");
    expect(avatar).toBeTruthy();
  });

});