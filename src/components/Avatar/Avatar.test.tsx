import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Avatar } from "./Avatar";

afterEach(() => {
  cleanup();
});

describe("Avatar Component", () => {

  it("renders fallback text when src is not provided", () => {
    render(<Avatar fallback="MS" />);

    const fallback = screen.getByText("MS");
    expect(fallback).toBeTruthy();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="avatar.png" alt="user avatar" />);

    const img = screen.getByAltText("user avatar");
    expect(img).toBeTruthy();
  });

  it("renders default alt text when alt not provided", () => {
    render(<Avatar src="avatar.png" />);

    const img = screen.getByAltText("avatar");
    expect(img).toBeTruthy();
  });

  it("applies correct size class", () => {
    const { container } = render(<Avatar fallback="MS" size="lg" />);

    const avatar = container.querySelector(".h-14");
    expect(avatar).toBeTruthy();
  });

  it("renders status indicator when status is provided", () => {
    const { container } = render(<Avatar fallback="MS" status="online" />);

    const status = container.querySelector(".bg-green-500");
    expect(status).toBeTruthy();
  });

  it("does not render status indicator when status not provided", () => {
    const { container } = render(<Avatar fallback="MS" />);

    const status = container.querySelector(".bg-green-500");
    expect(status).toBeNull();
  });

  it("renders empty span if fallback is undefined and no src", () => {
    const { container } = render(<Avatar />);

    const span = container.querySelector("span");
    expect(span).toBeTruthy();
  });

});