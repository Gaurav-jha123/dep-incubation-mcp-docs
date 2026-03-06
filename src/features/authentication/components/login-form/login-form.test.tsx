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

vi.mock("lucide-react", () => ({
  EyeOffIcon: () => <svg data-testid="eye-off-icon" />,
  User: () => <svg data-testid="user-icon" />,
}));

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
        "Please enter a valid email address.",
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
    it("accepts a valid complex password", () => {
      expect(
        loginFormSchema.safeParse({
          emailId: "user@example.com",
          password: "Secure1@",
        }).success,
      ).toBe(true);
    });

    it("rejects password shorter than 6 characters", () => {
      const result = loginFormSchema.safeParse({
        emailId: "user@example.com",
        password: "Ab1@",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
        "Password must be at least 6 characters long.",
      );
    });

    it("rejects password missing uppercase", () => {
      const result = loginFormSchema.safeParse({
        emailId: "user@example.com",
        password: "secure1@",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/uppercase/i);
    });

    it("rejects password missing lowercase", () => {
      const result = loginFormSchema.safeParse({
        emailId: "user@example.com",
        password: "SECURE1@",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/lowercase/i);
    });

    it("rejects password missing number", () => {
      const result = loginFormSchema.safeParse({
        emailId: "user@example.com",
        password: "Secure@@",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/number/i);
    });

    it("rejects password missing special character", () => {
      const result = loginFormSchema.safeParse({
        emailId: "user@example.com",
        password: "Secure123",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toMatch(/special character/i);
    });

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
    it("renders the welcome heading", () => {
      render(<LoginForm />);
      expect(screen.getByText(/Welcome to/i)).not.toBeNull();
    });

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
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email Id"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Valid1@pass" },
      });
      fireEvent.click(screen.getByTestId("login-submit-btn"));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          emailId: "test@example.com",
          password: "Valid1@pass",
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
        expect(screen.getByText(/valid email address/i)).not.toBeNull();
      });
    });

    it("shows password length error for short password", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Ab1@" },
      });
      fireEvent.blur(screen.getByLabelText("Password"));

      await waitFor(() => {
        expect(screen.getByText(/at least 6 characters/i)).not.toBeNull();
      });
    });

    it("shows password complexity error for missing special character", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "Password1" },
      });
      fireEvent.blur(screen.getByLabelText("Password"));

      await waitFor(() => {
        expect(screen.getByText(/special character/i)).not.toBeNull();
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

    it("email input has autocomplete off", () => {
      render(<LoginForm />);
      expect(
        (screen.getByLabelText("Email Id") as HTMLInputElement).autocomplete,
      ).toBe("off");
    });

    it("password input has autocomplete off", () => {
      render(<LoginForm />);
      expect(
        (screen.getByLabelText("Password") as HTMLInputElement).autocomplete,
      ).toBe("off");
    });
  });
});
