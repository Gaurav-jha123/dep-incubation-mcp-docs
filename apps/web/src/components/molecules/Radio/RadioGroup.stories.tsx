import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { RadioGroup, type Option } from "./RadioGroup";

const meta = {
  title: "Molecules/RadioGroup",
  component: RadioGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    className: { control: "text" },
    value: { control: "text" },
    defaultValue: { control: "text" },
    onChange: { action: "changed" },
    name: { control: "text" },
  },
  args: {
    size: "md",
    className: "",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
      { label: "Option 3", value: "3" },
    ] as Option[],
    name: "example",
    onChange: fn(),
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default RadioGroup
export const Default: Story = {};

// Pre-selected
export const PreSelected: Story = {
  args: {
    value: "2",
  },
};

// With disabled option
export const DisabledOption: Story = {
  args: {
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2", disabled: true },
      { label: "Option 3", value: "3" },
    ],
  },
};

// Small size
export const Small: Story = {
  args: {
    size: "sm",
  },
};

// Large size
export const Large: Story = {
  args: {
    size: "lg",
  },
};
