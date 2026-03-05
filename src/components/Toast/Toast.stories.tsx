import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "./Toast";

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    onClose: { action: "closed" }, 
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: {
    title: "System Notification",
    description: "A standard message for all dashboard alerts.",
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Settings saved successfully.",
  },
};

export const WithoutCloseButton: Story = {
  args: {
    title: "Processing...",
    description: "Please wait while we update the dashboard.",
    onClose: undefined,
  },
};

