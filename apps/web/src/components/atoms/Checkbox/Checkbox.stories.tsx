import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { useState } from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Atoms/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

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

export const WithoutLabel: Story = {
  args: {
    checked: false,
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