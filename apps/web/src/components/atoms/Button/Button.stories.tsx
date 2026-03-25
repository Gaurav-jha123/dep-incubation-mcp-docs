import type { Meta, StoryContext, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { expect, fn, userEvent } from "storybook/test";
import { Button, type ButtonProps } from "./Button";

const variantOptions = [
  "primary",
  "secondary",
  "danger",
  "ghost",
  "outline",
  "link",
] as const;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  {
    label: "Default",
    buttonText: "Default State",
    props: { pseudoState: "none" as const },
  },
  {
    label: "Hover",
    buttonText: "Hover State",
    props: { pseudoState: "hover" as const },
  },
  {
    label: "Active",
    buttonText: "Active State",
    props: { pseudoState: "active" as const },
  },
  {
    label: "Focus",
    buttonText: "Focus State",
    props: { pseudoState: "focus" as const },
  },
  {
    label: "Focus Visible",
    buttonText: "Focus Visible State",
    props: { pseudoState: "focus-visible" as const },
  },
  {
    label: "Disabled",
    buttonText: "Disabled State",
    props: { pseudoState: "disabled" as const },
  },
  {
    label: "Loading",
    buttonText: "Loading...",
    props: { isLoading: true },
  },
] as const;

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variantOptions,
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    disabled: {
      control: "boolean",
    },
    isLoading: {
      control: "boolean",
    },
    children: {
      control: "text",
    },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
    pseudoState: "none",
    disabled: false,
    isLoading: false,
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
    onClick: fn(),
  },
  play: async (context: StoryContext<ButtonProps>) => {
    const { canvas, args } = context;

    // 1. Find button (async → safe)
    const button = await canvas.findByRole("button", {
      name: /primary button/i,
    });

    // 2. Assert it exists
    await expect(button).toBeInTheDocument();

    // 3. Simulate user click
    await userEvent.click(button);

    // 4. Verify behavior
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Delete",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium Button",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Loading...",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Plus className="size-4" />
        Add Project
      </>
    ),
  },
};

export const AllVariants: Story = {
  args: {
    pseudoState: "none",
  },
  render: (args: ButtonProps) => (
    <div className="flex flex-wrap items-center gap-3">
      {variantOptions.map((variant) => (
        <Button
          key={variant}
          {...args}
          variant={variant}
          children={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} Button`}
        />
      ))}
    </div>
  ),
};

export const InteractiveHover: Story = {
  args: {
    pseudoState: "none",
  },
  parameters: {
    layout: "padded",
  },
  render: (args: ButtonProps) => (
    <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
      <p className="text-sm text-neutral-700">
        Move the mouse over these buttons to test the real hover behavior. This
        story does not force any pseudo state.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {variantOptions.map((variant) => (
          <Button
            key={variant}
            {...args}
            variant={variant}
            children={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} Button`}
          />
        ))}
      </div>
    </div>
  ),
};

const sizeOptions = ["lg", "md", "sm"] as const;

const sizeLabels: Record<(typeof sizeOptions)[number], string> = {
  lg: "Large",
  md: "Medium",
  sm: "Small",
};

const variantLabels: Record<(typeof variantOptions)[number], string> = {
  primary: "Primary",
  secondary: "Secondary",
  danger: "Error",
  ghost: "Ghost",
  outline: "Outline",
  link: "Text",
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
                      <Button
                        variant={variant}
                        size={size}
                        {...props}
                      >
                        LABEL
                      </Button>
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

