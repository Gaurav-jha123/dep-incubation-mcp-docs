import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import LoginForm from "./login-form";
import type { Label } from "@/components/ui/label";
import { loginFormSchema } from "@/lib/schema/login-form.zod";

const mockLogin = vi.fn();
const mockVerifyUser = vi.fn();

vi.mock("@/lib/hooks/use-auth/use-auth", () => ({
  default: () => ({
    login: mockLogin,
    verifyUser: mockVerifyUser,
  }),
}));

vi.mock("@/components/ui/field", () => ({
  Field: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  FieldError: ({ errors }: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined> }) => (
    <span role="alert">{errors?.[0]?.message}</span>
  ),
  FieldGroup: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>,
  FieldLabel: ({ children, htmlFor }: React.ComponentProps<typeof Label>) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  FieldSet: ({ children, ...props }: React.ComponentProps<'fieldset'>) => (
    <fieldset {...props}>{children}</fieldset>
  ),
}));

vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: React.ComponentProps<'div'>) => <div>{children}</div>,
  InputGroupAddon: ({ children }: React.ComponentProps<'div'>) => <span>{children}</span>,
  InputGroupInput: ({ ...props }: React.ComponentProps<'input'>) => <input {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("lucide-react", async () => {
  return {
    EyeOffIcon: () => <svg data-testid="eye-off-icon" />,
    User: () => <svg data-testid="user-icon" />,
    CheckCircle2: () => <svg data-testid="check-circle-icon" />,
    AlertCircle: () => <svg data-testid="alert-circle-icon" />,
    AlertTriangle: () => <svg data-testid="alert-triangle-icon" />,
    Info: () => <svg data-testid="info-icon" />,
    X: () => <svg data-testid="x-icon" />,
  };
});

// ─── Schema tests ─────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup();
});

describe("loginFormSchema", () => {
  describe("emailId", () => {
    it("accepts a valid email", () => {
      expect(
        loginFormSchema.safeParse({
          emailId: "user@example.com",
          password: "Valid1@pass",
        }).success,
      ).toBe(true);
    });

    it("rejects email without @", () => {
      const result = loginFormSchema.safeParse({
        emailId: "invalidemail",
        password: "Valid1@pass",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        "Email Id is required.",
      );
    });

    it("rejects empty email", () => {
      expect(
        loginFormSchema.safeParse({ emailId: "", password: "Valid1@pass" })
          .success,
      ).toBe(false);
    });

    it("rejects email without domain", () => {
      expect(
        loginFormSchema.safeParse({ emailId: "user@", password: "Valid1@pass" })
          .success,
      ).toBe(false);
    });
  });

  describe("password", () => {
    it("rejects empty password", () => {
      expect(
        loginFormSchema.safeParse({ emailId: "user@example.com", password: "" })
          .success,
      ).toBe(false);
    });
  });
});

// ─── Component tests ──────────────────────────────────────────────────────────

describe("LoginForm component", () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
    mockLogin.mockClear();
    mockVerifyUser.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    it("renders the email label and input", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Email Id")).not.toBeNull();
    });

    it("renders the password label and input", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Password")).not.toBeNull();
    });

    it("renders the login button", () => {
      render(<LoginForm />);
      expect(screen.getByTestId("login-submit-btn")).not.toBeNull();
    });

    it("renders password input as type password", () => {
      render(<LoginForm />);
      expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe(
        "password",
      );
    });

    it("renders user icon", () => {
      render(<LoginForm />);
      expect(screen.getByTestId("user-icon")).not.toBeNull();
    });

    it("renders eye-off icon", () => {
      render(<LoginForm />);
      expect(screen.getByTestId("eye-off-icon")).not.toBeNull();
    });
  });

  describe("on mount", () => {
    it("reads token from localStorage", () => {
      const getSpy = vi
        .spyOn(Storage.prototype, "getItem")
        .mockReturnValue("abc123");
      render(<LoginForm />);
      expect(getSpy).toHaveBeenCalledWith("token");
    });

    it("calls verifyUser with the stored token", () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue("my-token");
      render(<LoginForm />);
      expect(mockVerifyUser).toHaveBeenCalledWith("my-token");
    });

    it("calls verifyUser with empty string when no token stored", () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);
      render(<LoginForm />);
      expect(mockVerifyUser).toHaveBeenCalledWith("");
    });
  });

  describe("form submission", () => {
    it("calls login with valid credentials on submit", async () => {
  mockLogin.mockResolvedValue(undefined);
  render(<LoginForm />);

  fireEvent.change(screen.getByPlaceholderText("Input your email id"), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Input your password"), {
    target: { value: "123456" },
  });

  // trigger RHF validation so isValid becomes true and button enables
  fireEvent.blur(screen.getByPlaceholderText("Input your email id"));
  fireEvent.blur(screen.getByPlaceholderText("Input your password"));

  await waitFor(() => {
    expect(
      (screen.getByTestId("login-submit-btn") as HTMLButtonElement).disabled
    ).toBe(false);
  });

  fireEvent.click(screen.getByTestId("login-submit-btn"));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith({
      emailId: "test@example.com",
      password: "123456",
    });
  });
});

    it("does NOT call login when email is invalid", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email Id"), {
        target: { value: "not-an-email" },
      });
      fireEvent.click(screen.getByTestId("login-submit-btn"));

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });

    it("does NOT call login when password is too weak", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "weak" },
      });
      fireEvent.click(screen.getByTestId("login-submit-btn"));

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe("validation error messages", () => {
    it("shows email error on invalid input", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email Id"), {
        target: { value: "bad-email" },
      });
      fireEvent.blur(screen.getByLabelText("Email Id"));

      await waitFor(() => {
        expect(screen.getByText(/email id is required/i)).not.toBeNull();
      });
    });
  });

  describe("input interaction", () => {
    it("updates email field on change", () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email Id"), {
        target: { value: "new@test.com" },
      });

      expect(
        (screen.getByLabelText("Email Id") as HTMLInputElement).value,
      ).toBe("new@test.com");
    });

    it("updates password field on change", () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "NewPass1@" },
      });

      expect(
        (screen.getByLabelText("Password") as HTMLInputElement).value,
      ).toBe("NewPass1@");
    });
  });
});
