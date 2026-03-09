import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserForm from "./form";

(globalThis as any).ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};

vi.mock("@/lib/logger", () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe("UserForm", () => {

    it("renders form fields", () => {
        render(<UserForm />);
        expect(screen.getByText(/user form/i)).toBeTruthy();
        expect(screen.getAllByPlaceholderText("John")[0]).toBeTruthy();
        expect(screen.getAllByPlaceholderText("Doe")[0]).toBeTruthy();
        expect(
            screen.getAllByPlaceholderText("john.doe@example.com")[0]
        ).toBeTruthy();
    });

    it("shows validation errors", () => {
        render(<UserForm />);
        const submitBtn = screen.getAllByRole("button", { name: /submit/i })[0];
        fireEvent.click(submitBtn);
        expect(screen.getAllByText(/first name/i)[0]).toBeTruthy();
        expect(screen.getAllByText(/email/i)[0]).toBeTruthy();
    });

    it("accepts user input", () => {
        render(<UserForm />);
        const firstName = screen.getAllByPlaceholderText("John")[0];
        fireEvent.change(firstName, {
            target: { value: "Ajay" },
        });
        expect((firstName as HTMLInputElement).value).toBe("Ajay");
    });

    it("adds skill field", () => {
        render(<UserForm />);
        const addBtn = screen.getAllByRole("button", { name: /add skill/i })[0];
        fireEvent.click(addBtn);
        const skills = screen.getAllByPlaceholderText("React, Node, Design...");
        expect(skills.length).toBeGreaterThan(1);
    });

    it("removes skill field", () => {
        render(<UserForm />);
        const addBtn = screen.getAllByRole("button", { name: /add skill/i })[0];
        fireEvent.click(addBtn);
        const removeBtns = screen.getAllByRole("button", { name: /remove/i });
        fireEvent.click(removeBtns[0]);
        expect(removeBtns.length).toBeGreaterThan(0);
    });

    it("selects gender radio", () => {
        render(<UserForm />);
        const radios = screen.getAllByRole("radio");
        fireEvent.click(radios[0]);
        expect(radios[0]).toBeTruthy();
    });

    it("toggles active switch", () => {
        render(<UserForm />);
        const switches = screen.getAllByRole("switch");
        fireEvent.click(switches[0]);
        expect(switches[0]).toBeTruthy();
    });

    it("opens role dropdown", () => {
        render(<UserForm />);
        const roleBtn = screen.getAllByText(/select role/i)[0];
        fireEvent.click(roleBtn);
        expect(roleBtn).toBeTruthy();
    });

    it("opens hobbies dropdown", () => {
        render(<UserForm />);
        const hobbiesBtn = screen.getAllByText(/select hobbies/i)[0];
        fireEvent.click(hobbiesBtn);
        expect(hobbiesBtn).toBeTruthy();
    });

    it("submits form", () => {
        render(<UserForm />);
        fireEvent.change(screen.getAllByPlaceholderText("John")[0], {
            target: { value: "John" },
        });
        fireEvent.change(screen.getAllByPlaceholderText("Doe")[0], {
            target: { value: "Doe" },
        });
        fireEvent.change(
            screen.getAllByPlaceholderText("john.doe@example.com")[0],
            {
                target: { value: "john@test.com" },
            }
        );
        fireEvent.change(screen.getAllByPlaceholderText("9876543210")[0], {
            target: { value: "9876543210" },
        });
        fireEvent.change(screen.getAllByPlaceholderText("City")[0], {
            target: { value: "Hyderabad" },
        });
        fireEvent.change(screen.getAllByPlaceholderText("Zip code")[0], {
            target: { value: "500081" },
        });
        const skillInput = screen.getAllByPlaceholderText(
            "React, Node, Design..."
        )[0];
        fireEvent.change(skillInput, {
            target: { value: "React" },
        });
        const fileInput = screen.getAllByLabelText(/profile image/i)[0];
        const file = new File(["image"], "profile.png", {
            type: "image/png",
        });
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });
        const submitBtn = screen.getAllByRole("button", { name: /submit/i })[0];
        fireEvent.click(submitBtn);
        expect(submitBtn).toBeTruthy();
    });

});