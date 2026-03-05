import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, act } from "@testing-library/react";
import UserProfileMenu from "./user-profile-menu";
import type { ButtonProps } from "../Button/Button";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockLogout = vi.fn();

vi.mock("@/lib/hooks/use-auth/use-auth", () => ({
  default: () => ({ logout: mockLogout }),
}));

vi.mock("@/store/use-auth-store/use-auth-store", () => ({
  useAuthStore: () => ({
    fName: "John",
    lName: "Doe",
    emailId: "john.doe@example.com",
  }),
}));

vi.mock("@/components/ui/switch", () => ({
  Switch: (props: ButtonProps) => (
    <button role="switch" aria-label="toggle" {...props} />
  ),
}));

vi.mock("lucide-react", () => ({
  User: ({ className }: Record<string, string>) => (
    <svg data-testid="user-icon" className={className} />
  ),
  Moon: () => <svg data-testid="moon-icon" />,
  Settings: () => <svg data-testid="settings-icon" />,
  LogOut: () => <svg data-testid="logout-icon" />,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const click = (el: Element) =>
  act(() => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

const mousedown = (el: Element) =>
  act(() => el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })));

const openMenu = () => click(screen.getByTestId("profile-trigger"));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("UserProfileMenu", () => {
  beforeEach(() => {
    mockLogout.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  describe("closed state (default)", () => {
    it("renders the avatar trigger", () => {
      render(<UserProfileMenu />);
      expect(screen.getByTestId("profile-trigger")).not.toBeNull();
    });

    it("does not show the dropdown by default", () => {
      render(<UserProfileMenu />);
      expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("does not show user full name by default", () => {
      render(<UserProfileMenu />);
      expect(screen.queryByTestId("profile-full-name")).toBeNull();
    });

    it("does not show user email by default", () => {
      render(<UserProfileMenu />);
      expect(screen.queryByTestId("profile-email")).toBeNull();
    });

    it("does not show Settings item by default", () => {
      render(<UserProfileMenu />);
      expect(screen.queryByTestId("menu-item-settings")).toBeNull();
    });

    it("does not show Log out item by default", () => {
      render(<UserProfileMenu />);
      expect(screen.queryByTestId("menu-item-logout")).toBeNull();
    });
  });

  describe("open state (after clicking trigger)", () => {
    it("shows the dropdown after clicking trigger", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("profile-dropdown")).not.toBeNull();
    });

    it("displays full name from store", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("profile-full-name").textContent).toBe(
        "John Doe",
      );
    });

    it("displays email from store", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("profile-email").textContent).toBe(
        "john.doe@example.com",
      );
    });

    it("renders Dark Mode label", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByText("Dark Mode")).not.toBeNull();
    });

    it("renders the dark mode Switch", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByRole("switch")).not.toBeNull();
    });

    it("renders Settings menu item", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("menu-item-settings")).not.toBeNull();
    });

    it("renders Log out menu item", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("menu-item-logout")).not.toBeNull();
    });

    it("renders moon icon", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("moon-icon")).not.toBeNull();
    });

    it("renders settings icon", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("settings-icon")).not.toBeNull();
    });

    it("renders logout icon", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("logout-icon")).not.toBeNull();
    });
  });

  describe("toggle behaviour", () => {
    it("closes the menu when trigger is clicked again", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("profile-dropdown")).not.toBeNull();
      openMenu();
      expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("reopens the menu after closing", () => {
      render(<UserProfileMenu />);
      openMenu();
      openMenu(); // close
      openMenu(); // reopen
      expect(screen.getByTestId("profile-dropdown")).not.toBeNull();
    });
  });

  describe("menu item actions", () => {
    it("closes menu when Settings is clicked", () => {
      render(<UserProfileMenu />);
      openMenu();
      click(screen.getByTestId("menu-item-settings"));
      expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("closes menu when Log out is clicked", () => {
      render(<UserProfileMenu />);
      openMenu();
      click(screen.getByTestId("menu-item-logout"));
      expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("calls logout when Log out is clicked", () => {
      render(<UserProfileMenu />);
      openMenu();
      click(screen.getByTestId("menu-item-logout"));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    it("does NOT call logout when Settings is clicked", () => {
      render(<UserProfileMenu />);
      openMenu();
      click(screen.getByTestId("menu-item-settings"));
      expect(mockLogout).not.toHaveBeenCalled();
    });
  });

  describe("click outside", () => {
    it("closes the menu when clicking outside the component", () => {
      render(<UserProfileMenu />);
      openMenu();
      expect(screen.getByTestId("profile-dropdown")).not.toBeNull();
      mousedown(document.body);
      expect(screen.queryByTestId("profile-dropdown")).toBeNull();
    });

    it("keeps the menu open when clicking inside the component", () => {
      render(<UserProfileMenu />);
      openMenu();
      mousedown(screen.getByTestId("profile-dropdown"));
      expect(screen.getByTestId("profile-dropdown")).not.toBeNull();
    });
  });
});
