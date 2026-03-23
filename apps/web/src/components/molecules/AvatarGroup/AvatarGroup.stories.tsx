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
  args: {
    avatars: [
      { src: "https://via.placeholder.com/150" },
      { fallback: "KR" },
      { src: "https://via.placeholder.com/150", status: "busy" },
      { fallback: "TS" },
    ],
  },
};

export const LimitedVisible: Story = {
  args: {
    maxVisible: 3,
    avatars: [
      { fallback: "AB" },
      { fallback: "CD" },
      { fallback: "EF" },
      { fallback: "GH" },
      { fallback: "IJ" },
    ],
  },
};