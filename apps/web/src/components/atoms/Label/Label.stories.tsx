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
  parameters: {
    docs: {
      description: {
        story: "A basic label for form fields."
      }
    }
  },
  args: {
    label: "Username",
    htmlFor: "username",
  },
};

export const Required: Story = {
  parameters: {
    docs: {
      description: {
        story: "Label with required indicator for mandatory fields."
      }
    }
  },
  args: {
    label: "Email",
    htmlFor: "email",
    required: true,
  },
};

export const WithHelper: Story = {
  parameters: {
    docs: {
      description: {
        story: "Label with helper text for additional guidance."
      }
    }
  },
  args: {
    label: "Password",
    htmlFor: "password",
    helperText: "Minimum 8 characters",
  },
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: "Label with error message for invalid input."
      }
    }
  },
  args: {
    label: "Email",
    htmlFor: "email",
    error: "Invalid email address",
  },
};
