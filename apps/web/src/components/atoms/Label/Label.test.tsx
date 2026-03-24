import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Field } from "@headlessui/react";
import { Label } from "./Label";

afterEach(() => {
  cleanup();
});

const renderLabel = (props = {}) =>
  render(
    <Field>
      <Label {...props} />
    </Field>,
  );

describe("Label Component", () => {
  describe("rendering", () => {
    it("renders label text", () => {
      renderLabel({ label: "Username" });

      expect(screen.getByText("Username")).not.toBeNull();
    });
    it("does not render when label prop is not provided", () => {
      renderLabel();
      const label = screen.queryByText("Username");
      expect(label).toBeNull();
    });

    it("associates label with htmlFor", () => {
      renderLabel({ label: "Email", htmlFor: "email-input" });

      const label = screen.getByText("Email");

      expect(label.getAttribute("for")).toBe("email-input");
    });
  });

  describe("required state", () => {
    it("shows required asterisk when required is true", () => {
      renderLabel({ label: "Password", required: true });

      expect(screen.getByText("*")).not.toBeNull();
    });
  });

  describe("helper and error text", () => {
    it("renders helper text when provided", () => {
      renderLabel({
        label: "Username",
        helperText: "Enter your username",
      });

      expect(screen.getByText("Enter your username")).not.toBeNull();
    });

    it("renders error text when provided", () => {
      renderLabel({
        label: "Email",
        error: "Invalid email",
      });

      expect(screen.getByText("Invalid email")).not.toBeNull();
    });

    it("does not render helper text when error exists", () => {
      renderLabel({
        label: "Email",
        helperText: "Enter email",
        error: "Invalid email",
      });

      expect(screen.queryByText("Enter email")).toBeNull();
    });
  });

  describe("styling", () => {
    it("applies default label style", () => {
      renderLabel({ label: "Name" });

      const label = screen.getByText("Name");

      expect(label.className.includes("text-neutral-700")).toBe(true);
    });

    it("applies error style when error is present", () => {
      renderLabel({
        label: "Email",
        error: "Invalid email",
      });

      const label = screen.getByText("Email");

      expect(label.className.includes("text-danger-700")).toBe(true);
    });

    it("applies custom className", () => {
      renderLabel({
        label: "Name",
        className: "custom-class",
      });

      const label = screen.getByText("Name");

      expect(label.className.includes("custom-class")).toBe(true);
    });
  });
});
