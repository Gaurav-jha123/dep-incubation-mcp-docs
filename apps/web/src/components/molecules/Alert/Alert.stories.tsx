import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "Molecules/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: ["info", "success", "warning", "error"],
    },
    message: { control: "text" },
    closable: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type AlertStoryArgs = React.ComponentProps<typeof Alert>;

export const Info: Story = {
  args: {
    type: "info",
    message: "This is an info alert.",
  },
};

export const Success: Story = {
  args: {
    type: "success",
    message: "Operation successful!",
  },
};

export const Error: Story = {
  args: {
    type: "error",
    message: "Something went wrong.",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    message: "This is a warning alert.",
  },
};

export const Closable: Story = {
  render: (args: AlertStoryArgs) => {
    const [visible, setVisible] = useState(true);
    return (
      <div>
        {visible && (
          <Alert {...args} closable onClose={() => setVisible(false)} />
        )}
      </div>
    );
  },
  args: {
    type: "info",
    message: "You can close this alert.",
  },
};
