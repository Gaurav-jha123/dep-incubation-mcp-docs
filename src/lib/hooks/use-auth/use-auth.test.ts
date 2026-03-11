// src/lib/hooks/use-auth/use-auth.test.ts
import { renderHook, act } from "@testing-library/react";
import useAuth from "./use-auth";
import { describe, expect, test, vi, afterEach, beforeEach, type Mock } from "vitest";
import { jwtDecode } from "jwt-decode";
// Mock jwtDecode
vi.mock("jwt-decode");

// Mock Zustand store
vi.mock("@/store/use-auth-store/use-auth-store.ts", () => ({
  useAuthStore: () => ({
    setUserDetails: vi.fn(),
    clearUserDetails: vi.fn(),
  }),
}));

// Mock react-router navigation
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
beforeEach(() => {
  const storageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value.toString();
      },
      clear: vi.fn(() => (store = {})),
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  })();
  Object.defineProperty(global, "localStorage", {
    value: storageMock,
    writable: true,
  });
});

// Clear mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});

describe("use-auth", () => {
  test("should login and navigate to dashboard", () => {
    const decodedUser = {
      fName: "Suryateja",
      lName: "Kandukuru",
      emailId: "test@test.com",
    };

    (jwtDecode as Mock).mockReturnValue(decodedUser);

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login({
        email: "test@test.com",
        password: "123456",
      });
    });

    expect(localStorage.getItem("token")).toBeTruthy();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  test("should logout and navigate to login", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("should verify user and navigate to dashboard", () => {
    const mockToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmTmFtZSI6IlN1cnlhdGVqYSIsImxOYW1lIjoiS2FuZHVrdXJ1IiwiZW1haWxJZCI6InN1cnlhdGVqYV9rYW5kdWt1cnVAZXBhbS5jb20iLCJpYXQiOjE3NzI1MzUyNDUsImV4cCI6MTgwNjY5ODc1N30.BfPhvH1lUl3tkRW5ur78hhJo2gzJ-DNJnu8h_BqnbRE";

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.verifyUser(mockToken);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});