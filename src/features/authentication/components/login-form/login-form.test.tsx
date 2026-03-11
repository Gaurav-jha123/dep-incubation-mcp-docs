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
  Field: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  FieldError: ({
    errors,
  }: React.ComponentProps<"div"> & {
    errors?: Array<{ message?: string } | undefined>;
  }) => <span role="alert">{errors?.[0]?.message}</span>,
  FieldGroup: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div {...props}>{children}</div>
  ),
  FieldLabel: ({ children, htmlFor }: React.ComponentProps<typeof Label>) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
  FieldSet: ({ children, ...props }: React.ComponentProps<"fieldset">) => (
    <fieldset {...props}>{children}</fieldset>
  ),
}));

vi.mock("@/components/ui/input-group", () => ({
  InputGroup: ({ children }: React.ComponentProps<"div">) => (
    <div>{children}</div>
  ),
  InputGroupAddon: ({ children }: React.ComponentProps<"div">) => (
    <span>{children}</span>
  ),
  InputGroupInput: ({ ...props }: React.ComponentProps<"input">) => (
    <input {...props} />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: React.ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/components/Alert/Alert", () => ({
  Alert: ({ message, type }: { message: string; type: string }) => (
    <div role="note" data-type={type}>
      {message}
    </div>
  ),
}));

// ─── Schema tests ─────────────────────────────────────────────────────────────

afterEach(() => {
  cleanup();
});

describe("loginFormSchema", () => {
  describe("email", () => {
    it("accepts a valid email", () => {
      expect(
        loginFormSchema.safeParse({
          email: "user@example.com",
          password: "Valid1@pass",
        }).success,
      ).toBe(true);
    });

    it("rejects email without @", () => {
      const result = loginFormSchema.safeParse({
        email: "invalidemail",
        password: "Valid1@pass",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe("Email is required.");
    });

    it("rejects empty email", () => {
      expect(
        loginFormSchema.safeParse({ email: "", password: "Valid1@pass" })
          .success,
      ).toBe(false);
    });

    it("rejects email without domain", () => {
      expect(
        loginFormSchema.safeParse({ email: "user@", password: "Valid1@pass" })
          .success,
      ).toBe(false);
    });
  });

  describe("password", () => {
    it("rejects empty password", () => {
      expect(
        loginFormSchema.safeParse({ email: "user@example.com", password: "" })
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
    it("renders the email input", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Email")).not.toBeNull();
    });

    it("renders the password input", () => {
      render(<LoginForm />);
      expect(screen.getByLabelText("Password")).not.toBeNull();
    });

    it("renders the login button", () => {
      render(<LoginForm />);
      expect(screen.getByTestId("login-submit-btn")).not.toBeNull();
    });

    it("renders password input as type password", () => {
      render(<LoginForm />);
      expect(
        (screen.getByLabelText("Password") as HTMLInputElement).type,
      ).toBe("password");
    });

    it("renders the info alert message", () => {
      render(<LoginForm />);
      expect(screen.getByRole("note")).not.toBeNull();
    });

    it("renders the Login heading", () => {
      render(<LoginForm />);
      expect(screen.getByRole("heading", { name: /login/i })).not.toBeNull();
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

      fireEvent.change(screen.getByPlaceholderText("Enter email"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("Enter password"), {
        target: { value: "123456" },
      });

      fireEvent.blur(screen.getByPlaceholderText("Enter email"));
      fireEvent.blur(screen.getByPlaceholderText("Enter password"));

      await waitFor(() => {
        expect(
          (screen.getByTestId("login-submit-btn") as HTMLButtonElement).disabled,
        ).toBe(false);
      });

      fireEvent.click(screen.getByTestId("login-submit-btn"));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "123456",
        });
      });
    });

    it("does NOT call login when email is invalid", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "not-an-email" },
      });
      fireEvent.click(screen.getByTestId("login-submit-btn"));

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });

    it("does NOT call login when password is empty", async () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Password"), {
        target: { value: "" },
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

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "bad-email" },
      });
      fireEvent.blur(screen.getByLabelText("Email"));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).not.toBeNull();
      });
    });
  });

  describe("input interaction", () => {
    it("updates email field on change", () => {
      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText("Email"), {
        target: { value: "new@test.com" },
      });

      expect(
        (screen.getByLabelText("Email") as HTMLInputElement).value,
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