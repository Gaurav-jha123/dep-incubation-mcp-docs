import type { Meta, StoryObj } from '@storybook/react-vite';
import { Status } from "./Status";

const meta: Meta<typeof Status> = {
  title: "Atoms/Status",
  component: Status,
};
export default meta;

export const Success: StoryObj<typeof Status> = {
  args: { status: "success" },
};
