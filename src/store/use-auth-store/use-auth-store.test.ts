import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./use-auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    // reset store before each test
    useAuthStore.setState({
      accessToken: null,
      user: null,
      isLoggedIn: false,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);
  });

  it("should set user details", () => {
    const authStoreState = useAuthStore.getState();

    const setUserDetailsSpy = vi.spyOn(
      authStoreState,
      "setUserDetails"
    );

    const userDetails = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      token: "mock-token",
    };

    authStoreState.setUserDetails(userDetails);

    const state = useAuthStore.getState();

    expect(state.accessToken).toBe("mock-token");
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    });

    expect(setUserDetailsSpy).toHaveBeenCalledWith(userDetails);
  });

  it("should clear user details", () => {
    const authStoreState = useAuthStore.getState();

    const clearUserDetailsSpy = vi.spyOn(
      authStoreState,
      "clearUserDetails"
    );

    const userDetails = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      token: "mock-token",
    };

    authStoreState.setUserDetails(userDetails);

    authStoreState.clearUserDetails();

    const state = useAuthStore.getState();

    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isLoggedIn).toBe(false);

    expect(clearUserDetailsSpy).toHaveBeenCalled();
  });

  it("should set access token only", () => {
    const state = useAuthStore.getState();

    state.setAccessToken("new-token");

    const updatedState = useAuthStore.getState();

    expect(updatedState.accessToken).toBe("new-token");
    expect(updatedState.isLoggedIn).toBe(true);
  });
});