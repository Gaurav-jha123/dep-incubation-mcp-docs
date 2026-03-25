import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  RadioGroup,
  type Option,
  type RadioGroupProps,
} from "./RadioGroup";

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const } },
  { label: "Hover", props: { pseudoState: "hover" as const } },
  { label: "Active", props: { pseudoState: "active" as const } },
  { label: "Focus", props: { pseudoState: "focus" as const } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const } },
] as const;

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
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    disabled: { control: "boolean" },
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
    pseudoState: "none",
    disabled: false,
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

export const States: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args: RadioGroupProps) => (
    <div className="grid gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 md:grid-cols-2">
      {stateMatrix.map((state) => (
        <div
          key={state.label}
          className="space-y-3 rounded-md border border-neutral-200 bg-white p-4"
        >
          <p className="text-sm font-medium text-neutral-700">{state.label}</p>
          <RadioGroup {...args} {...state.props} />
        </div>
      ))}
    </div>
  ),
};
