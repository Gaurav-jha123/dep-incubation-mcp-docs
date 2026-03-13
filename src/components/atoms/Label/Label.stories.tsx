import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const meta: Meta<typeof Label> = {
  title: "Atoms/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Username",
    htmlFor: "username",
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    htmlFor: "email",
    required: true,
  },
};

export const WithHelper: Story = {
  args: {
    label: "Password",
    htmlFor: "password",
    helperText: "Minimum 8 characters",
  },
};

export const Error: Story = {
  args: {
    label: "Email",
    htmlFor: "email",
    error: "Invalid email address",
  },
};