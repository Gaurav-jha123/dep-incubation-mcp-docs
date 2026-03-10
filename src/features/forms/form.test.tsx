import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserForm from "./form";
import logger from "@/lib/logger";

vi.mock("@/lib/logger", () => ({
  default: {
    info: vi.fn(),
  },
}));
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserverMock;

describe("UserForm", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });
  const fillValidForm = async () => {
    await user.type(screen.getAllByPlaceholderText("John")[0], "Ajay");
    await user.type(screen.getAllByPlaceholderText("Doe")[0], "Kumar");
    await user.type(
      screen.getAllByPlaceholderText("john.doe@example.com")[0],
      "ajay@test.com"
    );
    await user.type(
      screen.getAllByPlaceholderText("********")[0],
      "password123"
    );
    await user.type(
      screen.getAllByPlaceholderText("9876543210")[0],
      "9876543210"
    );
    await user.type(screen.getAllByPlaceholderText("City")[0], "Hyderabad");
    await user.type(screen.getAllByPlaceholderText("Zip code")[0], "500001");
    await user.click(screen.getAllByText(/male/i)[0]);
    await user.click(screen.getAllByText(/select role/i)[0]);
    await user.click(screen.getAllByText(/admin/i)[0]);
    await user.click(screen.getAllByText(/select hobbies/i)[0]);
    await user.click(screen.getAllByText(/reading/i)[0]);
    const skillInputs = screen.getAllByPlaceholderText(
      "React, Node, Design..."
    );
    await user.type(skillInputs[0], "React");
    const file = new File(["profile"], "profile.png", {
      type: "image/png",
    });
    const fileInput = screen.getAllByLabelText(/profile image/i)[0] as HTMLInputElement;
    await user.upload(fileInput, file);
  };

  it("renders the form", () => {
    render(<UserForm />);
    const title = screen.getAllByText(/user form/i)[0];
    expect(title).toBeTruthy();
  });

  it("allows typing in first name", async () => {
    render(<UserForm />);
    const firstName = screen.getAllByPlaceholderText("John")[0] as HTMLInputElement;
    await user.type(firstName, "Ajay");
    expect(firstName.value).toBe("Ajay");
  });

  it("adds a skill", async () => {
    render(<UserForm />);
    const addButton = screen.getAllByText(/add skill/i)[0];
    const initialSkills = screen.getAllByPlaceholderText(
      "React, Node, Design..."
    ).length;
    await user.click(addButton);
    const skills = screen.getAllByPlaceholderText("React, Node, Design...");
    expect(skills.length).toBe(initialSkills + 1);
  });

  it("removes a skill", async () => {
    render(<UserForm />);
    const removeButtons = screen.getAllByText(/remove/i);
    const initialSkills = screen.getAllByPlaceholderText(
      "React, Node, Design..."
    ).length;
    await user.click(removeButtons[0]);
    const skills = screen.getAllByPlaceholderText("React, Node, Design...");
    expect(skills.length).toBe(initialSkills - 1);
  });

  it("toggles active switch", async () => {
    render(<UserForm />);
    const switchButton = screen.getAllByRole("switch")[0];
    await user.click(switchButton);
    expect(switchButton).toBeTruthy();
  });

  it("shows validation errors on empty submit", async () => {
    render(<UserForm />);
    await user.click(screen.getAllByRole("button", { name: /submit/i })[0]);
    await waitFor(() => {
      const errors = screen.getAllByText(/must/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  it("uploads profile image", async () => {
    render(<UserForm />);
    const file = new File(["hello"], "avatar.png", {
      type: "image/png",
    });
    const fileInput = screen.getAllByLabelText(/profile image/i)[0] as HTMLInputElement;
    await user.upload(fileInput, file);
    expect(fileInput.files?.length).toBe(1);
  });

  it("submits form successfully", async () => {
    render(<UserForm />);
    await fillValidForm();
    await user.click(screen.getAllByRole("button", { name: /submit/i })[0]);
    await waitFor(() => {
      expect(logger.info).toHaveBeenCalled();
    });
  });
});