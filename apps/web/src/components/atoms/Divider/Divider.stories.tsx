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

export const HorizontalSmall: Story = {
  args: {
    orientation: "horizontal",
    size: "sm",
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

export const HorizontalMedium: Story = {
  args: {
    orientation: "horizontal",
    size: "md",
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

export const HorizontalLarge: Story = {
  args: {
    orientation: "horizontal",
    size: "lg",
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

export const VerticalSmall: Story = {
  args: {
    orientation: "vertical",
    size: "sm",
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

export const VerticalMedium: Story = {
  args: {
    orientation: "vertical",
    size: "md",
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

export const VerticalLarge: Story = {
  args: {
    orientation: "vertical",
    size: "lg",
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
