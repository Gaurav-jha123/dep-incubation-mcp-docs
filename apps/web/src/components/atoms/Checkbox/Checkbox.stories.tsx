import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Checkbox } from "./Checkbox";
import { useState } from "react";
import type { CheckboxProps } from "./Checkbox";

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  {
    label: "Default",
    props: { pseudoState: "none" as const },
  },
  {
    label: "Hover",
    props: { pseudoState: "hover" as const },
  },
  {
    label: "Active",
    props: { pseudoState: "active" as const },
  },
  {
    label: "Focus",
    props: { pseudoState: "focus" as const },
  },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  {
    label: "Disabled",
    props: { pseudoState: "disabled" as const },
  },
] as const;

const meta = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    checked: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    label: {
      control: "text",
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
  },
  args: {
    label: "Accept Terms",
    checked: false,
    disabled: false,
    pseudoState: "none",
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Accept Terms",
    checked: false,
  },
};

export const Checked: Story = {
  args: {
    label: "Subscribed",
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled Checkbox",
    disabled: true,
    checked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Archived",
    disabled: true,
    checked: true,
  },
};

export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);

    return (
      <Checkbox
        label="Enable Notifications"
        checked={checked}
        onChange={setChecked}
      />
    );
  },
};

export const AllStates: Story = {
  args: {
    pseudoState: "none",
  },
  render: (args: CheckboxProps) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} label="Unchecked" checked={false} />
      <Checkbox {...args} label="Checked" checked />
      <Checkbox {...args} checked={false} />
    </div>
  ),
};

export const InteractiveHover: Story = {
  args: {
    pseudoState: "none",
  },
  parameters: {
    layout: "padded",
  },
  render: (args: CheckboxProps) => (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-sm text-neutral-700">
        Move the mouse over these checkboxes to test the real hover behavior. This
        story does not force any pseudo state.
      </p>
      <div className="flex flex-col gap-3">
        <Checkbox {...args} label="Unchecked" checked={false} />
        <Checkbox {...args} label="Checked" checked />
      </div>
    </div>
  ),
};

const selectionOptions = [
  {
    key: "unchecked",
    label: "Unchecked",
    checked: false,
  },
  {
    key: "checked",
    label: "Checked",
    checked: true,
  },
] as const;

export const StatesAndSelection: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-10 p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
              State
            </th>
            {selectionOptions.map((selection) => (
              <th
                key={selection.key}
                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                {selection.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {stateMatrix.map(({ label, props }) => (
            <tr key={label} className="border-t border-dashed border-neutral-200">
              <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-500">
                {label}
              </td>
              {selectionOptions.map((selection) => (
                <td key={selection.key} className="p-3 text-center">
                  <div className="inline-flex min-w-40 justify-start rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                    <Checkbox
                      label="Option"
                      checked={selection.checked}
                      {...props}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};