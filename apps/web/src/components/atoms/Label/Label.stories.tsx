import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";

const variantOptions = [
  "default",
  "required",
  "with helper",
  "error",
] as const;


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

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="space-y-1">
          <Label
          htmlFor={`${variant}-input`}
          required={variant === "required"}
          helperText={variant === "with helper" ? "Helper text goes here" : undefined}
          error={variant === "error" ? "Error message goes here" : undefined}
          label="Label" />
        </div>
      ))}
    </div>
  ),
};
