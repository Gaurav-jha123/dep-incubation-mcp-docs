import type { Meta, StoryObj } from "@storybook/react-vite";
import { AvatarGroup } from "./AvatarGroup";

const meta: Meta<typeof AvatarGroup> = {
  title: "Molecules/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Basic avatar group with images and initials."
      }
    }
  },
  args: {
    avatars: [
      { src: "https://via.placeholder.com/150" },
      { alt: "KR" },
      { src: "https://via.placeholder.com/150", status: "busy" },
      { alt: "TS" },
    ],
  },
};

export const LimitedVisible: Story = {
  parameters: {
    docs: {
      description: {
        story: "Avatar group with a maximum number of visible avatars."
      }
    }
  },
  args: {
    maxVisible: 3,
    avatars: [
      { alt: "AB" },
      { alt: "CD" },
      { alt: "EF" },
      { alt: "GH" },
      { alt: "IJ" },
    ],
  },
};