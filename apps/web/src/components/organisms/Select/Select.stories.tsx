import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select, type SelectPseudoState } from "./Select";

type SelectStoryProps = React.ComponentProps<typeof Select>;
type Story = StoryObj<typeof Select>;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default",      pseudoState: "none" as const },
  { label: "Hover",        pseudoState: "hover" as const },
  { label: "Active",       pseudoState: "active" as const },
  { label: "Focus",        pseudoState: "focus" as const },
  { label: "Focus Visible",pseudoState: "focus-visible" as const },
  { label: "Disabled",     pseudoState: "disabled" as const },
];

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Strawberry", value: "strawberry" },
];

const meta: Meta<typeof Select> = {
  title: "Organisms/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    options,
    value: "",
    placeholder: "Select an option",
    searchable: true,
    disabled: false,
    multiple: false,
    pseudoState: "none",
  },
  argTypes: {
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    pseudoState: { control: { type: "select" }, options: pseudoStateOptions },
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    className: { control: false },
  },
};

/* Stateful wrapper so Storybook updates selection */
const StatefulTemplate = (args: SelectStoryProps) => {
  const [value, setValue] = useState<string | string[]>(
    args.value ?? (args.multiple ? [] : "")
  );

  return (
    <div style={{ width: 320 }}>
      <Select {...args} value={value} onChange={setValue} />
    </div>
  );
};

/* Single Select */
export const Default: Story = {
  render: (args: SelectStoryProps) => <StatefulTemplate {...args} />,
  args: {
    placeholder: "Select",
  },
};

/* Multi Select */
export const MultiSelect: Story = {
  render: (args: SelectStoryProps) => <StatefulTemplate {...args} />,
  args: {
    multiple: true,
    placeholder: "Select",
  },
};

/* Disabled State */
export const Disabled: Story = {
  render: (args: SelectStoryProps) => <StatefulTemplate {...args} />,
  args: {
    disabled: true,
    value: "apple",
    placeholder: "Disabled select",
  },
};

/* All Pseudo States */
export const States: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args: SelectStoryProps) => (
    <div className="space-y-4">
      {stateMatrix.map((state) => (
        <div key={state.label} className="flex items-center gap-6">
          <p className="w-28 shrink-0 text-sm font-medium text-neutral-700">
            {state.label}
          </p>
          <StatefulTemplate
            {...args}
            pseudoState={state.pseudoState as SelectPseudoState}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    placeholder: "Select an option",
    searchable: true,
    multiple: false,
  },
};

export default meta;