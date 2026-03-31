import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./use-auth-store";
import type { IUser } from "@/services/api/auth.api";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoggedIn: false,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it("should set user details", () => {
    const userDetails = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };

    useAuthStore.getState().setUserDetails(userDetails as IUser & { accessToken: string; refreshToken: string });

    const state = useAuthStore.getState();

    expect(state.accessToken).toBe("mock-access-token");
    expect(state.refreshToken).toBe("mock-refresh-token");
    expect(state.isLoggedIn).toBe(true);

    expect(state.user).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    });
  });

  it("should clear user details", () => {
    const userDetails: IUser & { accessToken: string; refreshToken: string } = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      role: "EMPLOYEE"
    };

    const store = useAuthStore.getState();

    store.setUserDetails(userDetails);
    store.clearUserDetails();

    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it("should set access token only", () => {
    const store = useAuthStore.getState();

    store.setAccessToken("new-token");

    const updatedState = useAuthStore.getState();

    expect(updatedState.accessToken).toBe("new-token");
    expect(updatedState.isLoggedIn).toBe(true);
  });

  it("should set access token and refresh token", () => {
    const store = useAuthStore.getState();

    store.setAccessToken("new-token", "new-refresh");

    const updatedState = useAuthStore.getState();

    expect(updatedState.accessToken).toBe("new-token");
    expect(updatedState.refreshToken).toBe("new-refresh");
    expect(updatedState.isLoggedIn).toBe(true);
  });
});