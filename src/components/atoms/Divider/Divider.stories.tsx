import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const CustomStyling: Story = {
  args: {
    className: "bg-primary w-1/2 mx-auto h-[2px]",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};