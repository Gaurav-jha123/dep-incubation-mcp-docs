import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";
import { Mail, Lock, Eye } from "lucide-react";

const pseudoStateOptions = [
  "none",
  "focus-visible",
  "disabled",
  "required"
] as const;

const variantOptions = [
  "default",
  "success",
  "error",
  "outlined",
  // "with helper",
  // "Left icon",
  // "Right icon",
  // "With char count",
  // "Char count exceeded",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const,  helperText: "This field is mandatory" } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const, helperText: "This field is mandatory" },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const,helperText: "This field is mandatory" } },
  { label: "Required", props: { pseudoState: "required" as const, required: true , helperText: "This field is mandatory",} },
] as const;

const sizeOptions = ["sm", "md", "lg"] as const;

const sizeLabels: Record<(typeof sizeOptions)[number], string> = {
  lg: "Large",
  md: "Medium",
  sm: "Small",
};

const variantLabels: Record<(typeof variantOptions)[number], string> = {
  default: "Default",
  success: "Success",
  error: "Error",
  outlined: "Outlined",
  // "with helper": "With Helper",
  // "Left icon": "Left Icon",
  // "Right icon": "Right Icon",
  // "With char count": "With Character Count",
  // "Char count exceeded": "Character Count Exceeded",
};

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
    pseudoState: "none",
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
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
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
    pseudoState: "focus-visible",
  },
};

export const Success: Story = {
  args: {
    placeholder: "Username",
    label: "Username",
    variant: "success",
    helperText: "This username is available",
    defaultValue: "johndoe",
    pseudoState: "focus-visible",
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

export const Medium: Story = {
  args: {
    placeholder: "Medium input",
    label: "Medium Size",
    inputSize: "md",
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
    placeholder: "Outlined",
    label: "Outlined",
    variant: "outlined",
  },
};

export const OutlinedWithIcon: Story = {
  args: {
    placeholder: "Outlined with Icon",
    label: "Outlined with Icon",
    variant: "outlined",
    leftIcon: <Lock size={18} />,
  },
};


export const VariantsAndStates: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-10 p-8">
      {sizeOptions.map((size) => (
        <div key={size}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-3 text-left text-sm font-semibold text-neutral-900">
                  {sizeLabels[size]}
                </th>
                {variantOptions.map((variant) => (
                  <th
                    key={variant}
                    className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500"
                  >
                    {variantLabels[variant]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stateMatrix.map(({ label, props }) => (
                <tr
                  key={label}
                  className="border-t border-dashed border-neutral-200"
                >
                  <td className="sticky left-0 z-10 bg-white p-3 text-sm font-medium text-neutral-500">
                    {label}
                  </td>
                  {variantOptions.map((variant) => (
                    <td key={variant} className="p-3 text-center">
                      <Input
                        placeholder="Enter text..."
                        label="Label"
                        variant={variant}
                        inputSize={size}
                        {...props}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  ),
};
