import { Checkbox, Popover } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  onCreateOption?: (label: string) => void;
}

const MultiSelectSearch = ({ label, options, selected, onChange, onCreateOption }: Props) => {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase()),
        );

  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleCreate = () => {
    const trimmedValue = newOptionLabel.trim();

    if (!trimmedValue) {
      setError(`${label.slice(0, -1)} name is required.`);
      return;
    }

    const alreadyExists = options.some(
      (option) => option.label.trim().toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (alreadyExists) {
      setError(`${label.slice(0, -1)} already exists.`);
      return;
    }

    onCreateOption?.(trimmedValue);
    setNewOptionLabel("");
    setError(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setNewOptionLabel("");
    setError(null);
    setIsAdding(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-2">
        <Popover className="relative flex-1">
          {({ open }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (!open) {
                setQuery("");
              }
            }, [open]);

            return (
              <>
                <Popover.Button className="flex w-full items-center justify-between border rounded-md px-3 py-2 text-left">
                  <span className="flex items-center gap-2">
                    {selected.length > 0 ? (
                      <>
                        {label}
                        <span className="inline-flex items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                          {selected.length}
                        </span>
                      </>
                    ) : (
                      `Select ${label}`
                    )}
                  </span>
                  <ChevronDown className="size-4 shrink-0 opacity-50" />
                </Popover.Button>

                <Popover.Panel className="absolute z-50 mt-1 w-full rounded-md bg-white border shadow-lg p-2">
                  <input
                    type="text"
                    placeholder={`Search ${label}`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full border rounded-md px-2 py-1 mb-2"
                  />

                  <div className="max-h-60 overflow-auto">
                    {filteredOptions.length === 0 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No items found.
                      </div>
                    ) : (
                      filteredOptions.map((option) => (
                        <div
                          key={option.value}
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleValue(option.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleValue(option.value);
                            }
                          }}
                          className="flex items-start gap-3 px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
                        >
                          <Checkbox
                            checked={selected.includes(option.value)}
                            className="group shrink-0 flex size-4 items-center justify-center rounded border bg-white data-[checked]:bg-black data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
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

                          <span className="whitespace-normal break-words">
                            {option.label}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </Popover.Panel>
              </>
            );
          }}
        </Popover>
        {onCreateOption ? (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setIsAdding((current) => !current);
            }}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Add
          </button>
        ) : null}
      </div>
      {isAdding ? (
        <div className="mt-2 rounded-md border border-border p-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newOptionLabel}
              onChange={(e) => {
                setNewOptionLabel(e.target.value);
                if (error) {
                  setError(null);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }

                if (e.key === "Escape") {
                  e.preventDefault();
                  handleCancel();
                }
              }}
              placeholder={`Add ${label.slice(0, -1)}`}
              className="flex-1 rounded-md border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-input px-3 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
};

export default MultiSelectSearch;
