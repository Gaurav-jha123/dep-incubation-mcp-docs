import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./List";

const meta: Meta<typeof List> = {
  title: "Components/List/List",
  component: List,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        label: "Profile",
        description: "Manage your personal information",
      },
      {
        label: "Messages",
        description: "View new notifications",
      },
      {
        label: "Settings",
        description: "Configure your preferences",
      },
    ],
  },
};