import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  ComboboxButton,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export interface Option {
  label: string;
  value: string;
}

export type SelectPseudoState =
  | "none"
  | "hover"
  | "active"
  | "focus"
  | "focus-visible"
  | "disabled";

interface SelectProps {
  options: Option[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  pseudoState?: SelectPseudoState;
}

export function Select({
  options,
  value,
  onChange,
  multiple = false,
  searchable = true,
  placeholder = "Select...",
  disabled = false,
  className = "",
  pseudoState = "none",
}: SelectProps) {
  const isPseudoDisabled = pseudoState === "disabled";
  const [query, setQuery] = useState("");

  const values = Array.isArray(value) ? value : value ? [value] : [];

  const selectedOptions = options.filter((o) => values.includes(o.value));

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  function handleChange(selected: Option | Option[] | null) {
    if (!selected) return;

    if (Array.isArray(selected)) {
      onChange(selected.map((o) => o.value));
    } else {
      onChange(selected.value);
    }

    setQuery("");
  }

  return (
    <Combobox
      value={multiple ? selectedOptions : (selectedOptions[0] ?? null)}
      onChange={handleChange}
      multiple={multiple}
      disabled={disabled || isPseudoDisabled}
    >
      <div
        className={`w-full ${className}`}
        data-pseudo-state={pseudoState === "none" ? undefined : pseudoState}
      >
        <div className="relative">
          {/* Input */}
          {searchable ? (
            <ComboboxInput
              className={`w-full rounded-md border bg-neutral-50 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 data-[pseudo-state=focus]:border-primary-500 data-[pseudo-state=focus]:ring-1 data-[pseudo-state=focus]:ring-primary-500 data-[pseudo-state=focus-visible]:border-primary-500 data-[pseudo-state=focus-visible]:ring-1 data-[pseudo-state=focus-visible]:ring-primary-500 data-[pseudo-state=hover]:border-primary-300 data-[pseudo-state=disabled]:opacity-50 data-[pseudo-state=disabled]:cursor-not-allowed ${pseudoState === "focus" || pseudoState === "focus-visible" ? "border-primary-500 ring-1 ring-primary-500" : pseudoState === "hover" ? "border-primary-300" : "border-neutral-200"}`}
              displayValue={(option: Option) =>
                multiple ? "" : (option?.label ?? "")
              }
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />
          ) : (
            <div className="w-full rounded-md border border-neutral-200 bg-neutral-50 py-2 pl-3 pr-10 text-sm">
              {selectedOptions[0]?.label ?? placeholder}
            </div>
          )}

          {/* Dropdown Button */}
          <ComboboxButton
            aria-label="Toggle options"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-500"
          >
            <ChevronDown className="h-5 w-5 cursor-pointer" />
          </ComboboxButton>

          {/* Dropdown */}
          <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-50 shadow-lg ring-1 ring-neutral-900/5">
            {filteredOptions.length === 0 && (
              <div className="px-3 py-2 text-sm text-neutral-500">
                No results found
              </div>
            )}

            {filteredOptions.map((option) => (
              <ComboboxOption
                key={option.value}
                value={option}
                className={({ focus, disabled }) =>
                  `cursor-pointer select-none px-3 py-2 flex items-center gap-2 ${
                    focus
                      ? "bg-primary-200 text-primary-900"
                      : "text-neutral-900"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                }
              >
                {() => (
                  <>
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={values.includes(option.value)}
                        readOnly
                        className="pointer-events-none accent-black"
                      />
                    )}

                    {option.label}
                  </>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </div>
    </Combobox>
  );
}