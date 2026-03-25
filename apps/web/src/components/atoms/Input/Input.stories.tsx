import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";
import { Mail, Lock, Eye } from "lucide-react";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Enter text...",
    label: "Label",
    variant: "default",
    inputSize: "md",
    disabled: false,
    required: false,
    fullWidth: false,
    showCharCount: false,
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "error", "success", "outlined"],
    },
    inputSize: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    label: {
      control: "text",
    },
    helperText: {
      control: "text",
    },
    error: {
      control: "text",
    },
    placeholder: {
      control: "text",
    },
    maxLength: {
      control: { type: "number", min: 10, max: 500 },
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    fullWidth: { control: "boolean" },
    showCharCount: { control: "boolean" },
    leftIcon: { control: false },
    rightIcon: { control: false },
    className: { control: false },
    onClear: { control: false },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHelper: Story = {
  args: {
    placeholder: "example@email.com",
    label: "Email Address",
    helperText: "We will never share your email with anyone",
    required: true,
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: "example@email.com",
    label: "Email Address",
    leftIcon: <Mail size={18} />,
    required: true,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: "Enter password",
    label: "Password",
    type: "password",
    rightIcon: <Eye size={18} />,
    required: true,
  },
};

export const WithCharCount: Story = {
  args: {
    placeholder: "Write your bio",
    label: "Bio",
    maxLength: 150,
    showCharCount: true,
    helperText: "Tell us about yourself",
  },
};

export const CharCountExceeded: Story = {
  args: {
    placeholder: "Write your bio",
    label: "Bio",
    maxLength: 50,
    showCharCount: true,
    defaultValue: "This is a very long text that exceeds the character limit",
  },
};

export const Error: Story = {
  args: {
    placeholder: "Enter password",
    label: "Password",
    variant: "error",
    error: "Password must be at least 8 characters",
    defaultValue: "short",
  },
};

export const Success: Story = {
  args: {
    placeholder: "Username",
    label: "Username",
    variant: "success",
    helperText: "This username is available",
    defaultValue: "johndoe",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    label: "Disabled",
    disabled: true,
    defaultValue: "Cannot edit this",
  },
};

export const Small: Story = {
  args: {
    placeholder: "Small input",
    label: "Small Size",
    inputSize: "sm",
  },
};

export const Large: Story = {
  args: {
    placeholder: "Large input",
    label: "Large Size",
    inputSize: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: "Full width input",
    label: "Full Width",
    fullWidth: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: "Required field",
    label: "Required Field",
    required: true,
    helperText: "This field is mandatory",
  },
};

export const Outlined: Story = {
  args: {
    placeholder: "",
    label: "Outlined",
    variant: "outlined",
  },
};

export const OutlinedWithIcon: Story = {
  args: {
    placeholder: "",
    label: "Outlined with Icon",
    variant: "outlined",
    leftIcon: <Lock size={18} />,
  },
};
