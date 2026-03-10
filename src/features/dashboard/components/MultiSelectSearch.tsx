import { Checkbox, Popover } from "@headlessui/react";
import { useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
}

const MultiSelectSearch = ({ label, options, selected, onChange }: Props) => {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

  console.log("filtered options", filteredOptions);

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  console.log(`selected ${label}...`, selected);
  return (
    <div className="w-64">
      <Popover className="relative">
        <Popover.Button className="w-full border rounded-md px-3 py-2 text-left">
          {selected.length > 0
            ? `${label} ( ${selected.length} )`
            : `Select ${label}`}
        </Popover.Button>

        <Popover.Panel className="absolute z-50 mt-1 w-full rounded-md bg-white border shadow-lg p-2">
          {/* Search */}
          <input
            type="text"
            placeholder={`Search ${label}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border rounded-md px-2 py-1 mb-2"
          />

          {/* Options */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => toggleValue(option.value)}
                className="flex items-center gap-3 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  className="group flex size-4 items-center justify-center rounded border bg-white 
             data-[checked]:bg-black 
             data-[disabled]:cursor-not-allowed 
             data-[disabled]:opacity-50"
                >
                  <svg
                    className="stroke-white opacity-0 group-data-checked:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M3 8L6 11L11 3.5"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Checkbox>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default MultiSelectSearch;
