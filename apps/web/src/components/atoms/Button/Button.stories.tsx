import type { Meta, StoryObj } from "@storybook/react-vite";
import { Plus } from "lucide-react";
import { fn } from "storybook/test";
import { Button } from "./Button";

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
  render: (args) => (
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
  render: (args) => (
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

export const PseudoStates: Story = {
  parameters: {
    layout: "padded",
  },
  render: (args) => (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {stateMatrix.map(({ label, buttonText, props }) => (
        <div
          key={label}
          className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
        >
          <p className="mb-3 text-sm font-medium capitalize text-neutral-700">
            {label}
          </p>
          <Button
            {...args}
            {...props}
            children={buttonText}
          />
        </div>
      ))}
    </div>
  ),
};

