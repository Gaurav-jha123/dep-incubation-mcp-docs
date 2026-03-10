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
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
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
    options,
    value: "",
    placeholder: "Select",
  },
};

/* Multi Select */
export const MultiSelect: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    options,
    value: "",
    multiple: true,
    placeholder: "Select",
  },
};

/* Disabled */
export const Disabled: Story = {
  args: {
    options,
    value: "",
    disabled: true,
  },
};

/* Preselected Multi */
export const WithPreselectedValues: Story = {
  render: (args) => <StatefulTemplate {...args} />,
  args: {
    options,
    value: ["apple", "banana"],
    multiple: true,
  },
};
export default meta;