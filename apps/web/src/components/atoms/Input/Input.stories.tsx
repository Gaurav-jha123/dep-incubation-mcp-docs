import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, type InputProps } from "./Input";
import { Mail, Lock, Eye } from "lucide-react";

const variantOptions = ["default", "error", "success", "outlined"] as const;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const } },
  { label: "Hover", props: { pseudoState: "hover" as const } },
  { label: "Active", props: { pseudoState: "active" as const } },
  { label: "Focus", props: { pseudoState: "focus" as const } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const } },
] as const;

const variantLabels: Record<(typeof variantOptions)[number], string> = {
  default: "Default",
  error: "Error",
  success: "Success",
  outlined: "Outlined",
};

function getVariantStoryArgs(
  variant: (typeof variantOptions)[number],
  state: (typeof stateMatrix)[number]["props"]["pseudoState"],
): Partial<InputProps> {
  const baseValue = state === "active" ? "typed@example.com" : undefined;

  switch (variant) {
    case "error":
      return {
        variant,
        label: "Password",
        placeholder: "Enter password",
        type: "password",
        error: "Password must be at least 8 characters",
        defaultValue: state === "disabled" ? "short" : (baseValue ?? "short"),
        rightIcon: <Eye size={18} />,
      };
    case "success":
      return {
        variant,
        label: "Username",
        placeholder: "Enter username",
        helperText: "This username is available",
        defaultValue:
          state === "disabled" ? "johndoe" : (baseValue ?? "johndoe"),
        leftIcon: <Mail size={18} />,
      };
    case "outlined":
      return {
        variant,
        label: "Email Address",
        placeholder: "",
        helperText: "Outlined variant with floating label",
        defaultValue: "name@example.com",
        leftIcon: <Lock size={18} />,
      };
    case "default":
    default:
      return {
        variant: "default",
        label: "Email Address",
        placeholder: "name@example.com",
        helperText: "Use pseudoState to preview interaction styling.",
        defaultValue: state === "active" ? "typed@example.com" : undefined,
        leftIcon: <Mail size={18} />,
      };
  }
}

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
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    fullWidth: { control: "boolean" },
    showCharCount: { control: "boolean" },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
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

export const PseudoStatePreview: Story = {
  args: {
    label: "Email Address",
    placeholder: "name@example.com",
    helperText: "Use pseudoState to preview interaction styling.",
    leftIcon: <Mail size={18} />,
    fullWidth: true,
    pseudoState: "none",
  },
  parameters: {
    layout: "padded",
  },
  render: (args: InputProps) => (
    <div className="grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stateMatrix.map(({ label, props }) => (
        <div
          key={label}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">{label}</p>
          <Input
            {...args}
            {...props}
            defaultValue={
              label === "Active" ? "pressed@example.com" : undefined
            }
          />
        </div>
      ))}
    </div>
  ),
};

export const VariantsAndStates: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-8 p-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-neutral-50 p-3 text-left text-sm font-semibold text-neutral-900">
              State
            </th>
            {variantOptions.map((variant) => (
              <th
                key={variant}
                className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-700"
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
              <td className="sticky left-0 z-10 bg-neutral-50 p-3 align-top text-sm font-medium text-neutral-700">
                {label}
              </td>
              {variantOptions.map((variant) => (
                <td key={`${label}-${variant}`} className="p-3 align-top">
                  <div className="isolate min-w-[260px] rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                    <Input
                      fullWidth
                      inputSize="md"
                      required={variant !== "success"}
                      {...getVariantStoryArgs(variant, props.pseudoState)}
                      {...props}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
