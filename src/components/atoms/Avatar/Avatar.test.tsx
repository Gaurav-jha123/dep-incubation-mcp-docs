import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Avatar } from "./Avatar";

afterEach(() => cleanup());

describe("Avatar Component", () => {

  it("renders fallback text when src is not provided", () => {
    render(<Avatar fallback="MS" />);
    expect(screen.getByText("MS")).toBeTruthy();
  });

  it("renders image when src is provided", () => {
    render(<Avatar src="avatar.png" alt="user avatar" />);
    expect(screen.getByAltText("user avatar")).toBeTruthy();
  });

  it("renders default alt text when alt not provided", () => {
    render(<Avatar src="avatar.png" />);
    expect(screen.getByAltText("avatar")).toBeTruthy();
  });

  it("applies correct size class", () => {
    const { container } = render(<Avatar fallback="MS" size="lg" />);
    const avatar = container.querySelector(".h-14");
    expect(avatar).toBeTruthy();
  });

  it("renders status indicator when status is provided", () => {
    const { container } = render(<Avatar fallback="MS" status="online" />);
    const status = container.querySelector(".bg-success-500");
    expect(status).toBeTruthy();
  });

  it("renders correct status colors", () => {
    const { container } = render(<Avatar fallback="MS" status="busy" />);
    const status = container.querySelector(".bg-danger-500");
    expect(status).toBeTruthy();
  });

  it("does not render status indicator when status not provided", () => {
    const { container } = render(<Avatar fallback="MS" />);
    const status = container.querySelector(".bg-success-500");
    expect(status).toBeNull();
  });

  it("renders empty span if fallback is undefined and no src", () => {
    const { container } = render(<Avatar />);
    const span = container.querySelector("span");
    expect(span).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(<Avatar fallback="MS" className="custom" />);
    const avatar = container.querySelector(".custom");
    expect(avatar).toBeTruthy();
  });

  it("supports xl size", () => {
    const { container } = render(<Avatar fallback="MS" size="xl" />);
    const avatar = container.querySelector(".h-20");
    expect(avatar).toBeTruthy();
  });

  it("uses the updated neutral fallback surface", () => {
    const { container } = render(<Avatar fallback="MS" />);
    const avatar = container.querySelector(".bg-neutral-200");
    expect(avatar).toBeTruthy();
  });

});