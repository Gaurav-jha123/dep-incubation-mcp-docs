import { describe, it, expect, afterEach } from "vitest";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { Avatar } from "./Avatar";

afterEach(() => cleanup());

describe("Avatar Component", () => {
  it("renders alt text when src is not provided", () => {
    render(<Avatar alt="MS" />);
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
    const { container } = render(<Avatar alt="MS" size="lg" />);
    const avatar = container.querySelector(".h-14");
    expect(avatar).toBeTruthy();
  });

  it("renders status indicator when status is provided", () => {
    const { container } = render(<Avatar alt="MS" status="online" />);
    const status = container.querySelector(".bg-success-500");
    expect(status).toBeTruthy();
  });

  it("renders correct status colors", () => {
    const { container } = render(<Avatar alt="MS" status="busy" />);
    const status = container.querySelector(".bg-danger-500");
    expect(status).toBeTruthy();
  });

  it("does not render status indicator when status not provided", () => {
    const { container } = render(<Avatar alt="MS" />);
    const status = container.querySelector(".bg-success-500");
    expect(status).toBeNull();
  });

  it("renders alt text when no src is provided", () => {
    render(<Avatar alt="User avatar" />);
    expect(screen.getByText("User avatar")).toBeTruthy();
  });

  it("renders alt text when the image fails to load", () => {
    render(<Avatar src="missing-image.png" alt="User avatar" />);

    fireEvent.error(screen.getByAltText("User avatar"));

    expect(screen.getByText("User avatar")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { container } = render(<Avatar alt="MS" className="custom" />);
    const avatar = container.querySelector(".custom");
    expect(avatar).toBeTruthy();
  });

  it("supports xl size", () => {
    const { container } = render(<Avatar alt="MS" size="xl" />);
    const avatar = container.querySelector(".h-20");
    expect(avatar).toBeTruthy();
  });
});