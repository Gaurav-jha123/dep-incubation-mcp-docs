import { useState } from "react";
import { Dropdown } from "../../../components/organisms/Dropdown/Dropdown";
import { Badge, Input } from "@/components/atoms";
import { Checkbox } from "../../../components/atoms/Checkbox/Checkbox";
import {Button} from "@/components/atoms/Button/Button";

interface Option {
  value: string;
  label: string;
}

interface Props {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  enableAdd?: boolean;
  onCreateOption?: (label: string) => void;
}

const MultiSelectSearch = ({
  label,
  options,
  selected,
  enableAdd,
  onChange,
  onCreateOption,
}: Props) => {
  const [query, setQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
 

  const filteredOptions =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
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
      (option) =>
        option.label.trim().toLowerCase() === trimmedValue.toLowerCase()
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
        <Dropdown className="w-full">
          <Dropdown.Trigger className="w-full flex items-center justify-between rounded-md bg-neutral-50 border border-neutral-300 px-4 py-2">
            <div className="flex items-center gap-2">
              {selected.length > 0 ? (
                <>
                  {label}
                  <Badge text={selected.length.toString()} variant="info" />
                </>
              ) : (
                `Select ${label}`
              )}
            </div>
          </Dropdown.Trigger>

          <Dropdown.Content className="w-full max-h-60 overflow-auto">
            <Input
              type="text"
              placeholder={`Search ${label}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputSize="sm"
            />
            {filteredOptions.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-neutral-700">
                No items found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="rounded-md px-2 py-1 hover:bg-neutral-100"
                  >
                    <Checkbox
                      label={option.label}
                      checked={selected.includes(option.value)}
                      onChange={() => toggleValue(option.value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </Dropdown.Content>
        </Dropdown>

        {enableAdd && onCreateOption && (
          <Button
            role="button"
            onClick={() => {
              setError(null);
              setIsAdding((current) => !current);
            }}
            variant="outline"
          >
            Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mt-2 rounded-md border border-border p-3">
          <div className="flex gap-2">
            <Input
              value={newOptionLabel}
              onChange={(e) => {
                setNewOptionLabel(e.target.value);
                if (error) setError(null);
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
              inputSize="sm"
            />
            <Button onClick={handleCreate} variant="primary" size="sm">
              Save
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="rounded-md border border-input px-3 py-2 text-sm font-medium"
              size="sm"
            >
              Cancel
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default MultiSelectSearch;