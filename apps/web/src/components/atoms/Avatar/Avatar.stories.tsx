import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { src: "https://via.placeholder.com/150" },
};

export const Fallback: Story = {
  args: { fallback: "KR" },
};

export const Status: Story = {
  args: {
    src: "https://via.placeholder.com/150",
    status: "online",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-4">
      <Avatar fallback="A" size="sm" />
      <Avatar fallback="A" size="md" />
      <Avatar fallback="A" size="lg" />
      <Avatar fallback="A" size="xl" />
    </div>
  ),
};