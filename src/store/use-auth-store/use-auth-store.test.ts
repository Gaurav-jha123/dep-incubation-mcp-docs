import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "./use-auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    // reset store before each test
    useAuthStore.setState({
      fName: null,
      lName: null,
      emailId: null,
      isLoggedIn: false,
      iat: null,
      exp: null,
    });
  });

  it("should have initial state", () => {
    const state = useAuthStore.getState();

    expect(state.fName).toBeNull();
    expect(state.lName).toBeNull();
    expect(state.emailId).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.iat).toBeNull();
    expect(state.exp).toBeNull();
  });

  it("should set user details", () => {
    const authStoreState = useAuthStore.getState();

    const setUserDetailsSpy = vi.spyOn(
      authStoreState,
      "setUserDetails"
    );

    const userDetails = {
      fName: "John",
      lName: "Doe",
      emailId: "john@example.com",
      isLoggedIn: true,
      iat: 123,
      exp: 456,
    };

    authStoreState.setUserDetails(userDetails);

    const state = useAuthStore.getState();

    expect(state.fName).toBe("John");
    expect(state.lName).toBe("Doe");
    expect(state.emailId).toBe("john@example.com");
    expect(state.isLoggedIn).toBe(true);
    expect(state.iat).toBe(123);
    expect(state.exp).toBe(456);
    expect(setUserDetailsSpy).toHaveBeenCalledWith(userDetails);
  });

  it("should clear user details", () => {
    const authStoreState = useAuthStore.getState();

    const clearUserDetailsSpy = vi.spyOn(
      authStoreState,
      "clearUserDetails",
    );

    const userDetails = {
      fName: "John",
      lName: "Doe",
      emailId: "john@example.com",
      isLoggedIn: true,
      iat: 123,
      exp: 456,
    };

    authStoreState.setUserDetails(userDetails);

    authStoreState.clearUserDetails();

    const state = useAuthStore.getState();

    expect(state.fName).toBeNull();
    expect(state.lName).toBeNull();
    expect(state.emailId).toBeNull();
    expect(state.isLoggedIn).toBe(false);
    expect(state.iat).toBeNull();
    expect(state.exp).toBeNull();

    expect(clearUserDetailsSpy).toHaveBeenCalled()
  });
});
