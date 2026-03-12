import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { Select } from "./Select";

afterEach(() => {
    cleanup();
});

const options = [
    { label: "React", value: "react" },
    { label: "Angular", value: "angular" },
    { label: "Vue", value: "vue" },
];

describe("Select Component", () => {

    it("renders placeholder", () => {
        render(
            <Select
                options={options}
                value=""
                onChange={() => { }}
                placeholder="Select option"
            />
        );

        const input = screen.getByPlaceholderText("Select option");
        expect(input).toBeTruthy();
    });

    it("opens dropdown and shows options", () => {
        render(<Select options={options} value="" onChange={() => { }} />);

        fireEvent.click(screen.getByLabelText("Toggle options"));

        expect(screen.getByText("React")).toBeTruthy();
        expect(screen.getByText("Angular")).toBeTruthy();
        expect(screen.getByText("Vue")).toBeTruthy();
    });

    it("filters options based on input", () => {
        render(<Select options={options} value="" onChange={() => { }} />);

        const input = screen.getByRole("combobox");

        fireEvent.change(input, { target: { value: "ang" } });

        expect(screen.getByText("Angular")).toBeTruthy();
    });

    it("shows no results message when filter has no match", () => {
        render(<Select options={options} value="" onChange={() => { }} />);

        const input = screen.getByRole("combobox");

        fireEvent.change(input, { target: { value: "xyz" } });

        expect(screen.getByText("No results found")).toBeTruthy();
    });

    it("renders selected value", () => {
        render(
            <Select
                options={options}
                value="react"
                onChange={() => { }}
            />
        );

        expect(screen.getByDisplayValue("React")).toBeTruthy();
    });

    it("does not render dropdown options before opening", () => {
        render(<Select options={options} value="" onChange={() => { }} />);

        const option = screen.queryByText("React");

        expect(option).toBeNull();
    });

    it("opens dropdown when button is clicked", () => {
        render(<Select options={options} value="" onChange={() => { }} />);

        const button = screen.getByLabelText("Toggle options");

        fireEvent.click(button);

        expect(screen.getByText("React")).toBeTruthy();
    });

    it("disables select when disabled prop is true", () => {
        render(
            <Select
                options={options}
                value=""
                onChange={() => { }}
                disabled
            />
        );

        const input = screen.getByRole("combobox");

        expect(input.hasAttribute("disabled")).toBeTruthy();
    });

});