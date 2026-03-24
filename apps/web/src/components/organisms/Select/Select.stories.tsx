import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select } from "./Select";

type Story = StoryObj<typeof Select>;

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
  },
  argTypes: {
    multiple: { control: "boolean" },
    searchable: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
    options: { control: false },
    value: { control: false },
    onChange: { control: false },
    className: { control: false },
  },
};

/* Stateful wrapper so Storybook updates selection */
const StatefulTemplate = (args: React.ComponentProps<typeof Select>) => {
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
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    placeholder: "Select",
  },
};

/* Multi Select */
export const MultiSelect: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    multiple: true,
    placeholder: "Select",
  },
};
/* Disabled State */
export const Disabled: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    disabled: true,
    value: "apple",
    placeholder: "Disabled select",
  },
};
export default meta;