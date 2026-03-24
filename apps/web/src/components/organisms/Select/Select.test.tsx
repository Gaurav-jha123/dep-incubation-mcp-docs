import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { Select } from "./Select";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

afterEach(() => {
  cleanup();
});

const options = [
  { label: "React", value: "react" },
  { label: "Angular", value: "angular" },
  { label: "Vue", value: "vue" },
];

const getSelectWithMockedHeadlessUi = async () => {
  vi.resetModules();

  vi.doMock("@headlessui/react", () => {
    const Combobox = ({
      children,
      onChange,
    }: {
      children: ReactNode;
      onChange?: (value: unknown) => void;
    }) => (
      <div>
        <button
          onClick={() => onChange?.(null)}
          aria-label="trigger-null-change"
        >
          trigger-null-change
        </button>
        {children}
      </div>
    );

    const ComboboxInput = ({ placeholder }: { placeholder?: string }) => (
      <input placeholder={placeholder} />
    );

    const ComboboxButton = ({
      children,
      ...props
    }: {
      children?: ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>;

    const ComboboxOptions = ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    );

    const ComboboxOption = ({
      className,
      children,
    }: {
      className?:
        | string
        | ((state: { focus: boolean; disabled: boolean }) => string);
      children?: ReactNode | (() => ReactNode);
    }) => {
      const activeClasses =
        typeof className === "function"
          ? className({ focus: true, disabled: true })
          : (className ?? "");

      const idleClasses =
        typeof className === "function"
          ? className({ focus: false, disabled: false })
          : (className ?? "");

      const renderedChildren =
        typeof children === "function" ? children() : children;

      return (
        <>
          <div data-testid="option-active" className={activeClasses}>
            {renderedChildren}
          </div>
          <div data-testid="option-idle" className={idleClasses}>
            {renderedChildren}
          </div>
        </>
      );
    };

    return {
      Combobox,
      ComboboxInput,
      ComboboxButton,
      ComboboxOptions,
      ComboboxOption,
    };
  });

  const mod = await import("./Select");
  vi.doUnmock("@headlessui/react");
  return mod.Select;
};

describe("Select Component", () => {
  it("opens dropdown and shows options", () => {
    render(<Select options={options} value="" onChange={() => {}} />);

    fireEvent.click(screen.getByLabelText("Toggle options"));

    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("Angular")).toBeTruthy();
    expect(screen.getByText("Vue")).toBeTruthy();
  });

  it("filters options based on input", () => {
    render(<Select options={options} value="" onChange={() => {}} />);

    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "ang" } });

    expect(screen.getByText("Angular")).toBeTruthy();
  });

  it("shows no results message when filter has no match", () => {
    render(<Select options={options} value="" onChange={() => {}} />);

    const input = screen.getByRole("combobox");

    fireEvent.change(input, { target: { value: "xyz" } });

    expect(screen.getByText("No results found")).toBeTruthy();
  });

  it("renders selected value", () => {
    render(<Select options={options} value="react" onChange={() => {}} />);

    expect(screen.getByDisplayValue("React")).toBeTruthy();
  });

  it("calls onChange with selected value in single mode", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Select options={options} value="" onChange={onChange} />);

    await user.click(screen.getByLabelText("Toggle options"));
    await user.click(screen.getByRole("option", { name: "React" }));

    expect(onChange).toHaveBeenCalledWith("react");
  });

  it("calls onChange with selected values in multiple mode", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Select options={options} value={[]} onChange={onChange} multiple />,
    );

    await user.click(screen.getByLabelText("Toggle options"));
    await user.click(screen.getByRole("option", { name: "Vue" }));

    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });

  it("renders static placeholder when searchable is false and no value selected", () => {
    render(
      <Select
        options={options}
        value=""
        onChange={() => {}}
        searchable={false}
        placeholder="Pick framework"
      />,
    );

    expect(screen.getByText("Pick framework")).toBeTruthy();
  });

  it("renders static selected label when searchable is false and value exists", () => {
    render(
      <Select
        options={options}
        value="react"
        onChange={() => {}}
        searchable={false}
      />,
    );

    expect(screen.getByText("React")).toBeTruthy();
  });

  it("does not call onChange when combobox emits null selection", async () => {
    const MockedSelect = await getSelectWithMockedHeadlessUi();
    const onChange = vi.fn();

    render(<MockedSelect options={options} value="" onChange={onChange} />);

    fireEvent.click(screen.getByLabelText("trigger-null-change"));

    expect(onChange).not.toHaveBeenCalled();
  });
});
