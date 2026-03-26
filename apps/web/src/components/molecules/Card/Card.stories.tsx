import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, type CardProps } from "./Card";

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

const matrixVariants = [
  {
    key: "simple",
    label: "Simple",
    args: {
      variant: "simple",
      children: "Simple card content with supporting text.",
    },
  },
  {
    key: "header",
    label: "Header",
    args: {
      variant: "header",
      title: "Profile",
      subtitle: "User details",
      children: "Card content",
    },
  },
  {
    key: "image",
    label: "Image",
    args: {
      variant: "image",
      imageSrc: "https://via.placeholder.com/300x150",
      imageAlt: "Placeholder",
      children: "Content under image",
    },
  },
  {
    key: "actions",
    label: "Actions",
    args: {
      variant: "actions",
      title: "Confirm",
      children: "Are you sure?",
      actions: (
        <>
          <button className="rounded border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700">
            Cancel
          </button>
          <button className="rounded bg-neutral-900 px-3 py-1 text-neutral-50">
            OK
          </button>
        </>
      ),
    },
  },
  {
    key: "styled-solid",
    label: "Styled Solid",
    args: {
      variant: "styled",
      styleVariant: "solid",
      children: "Styled card with solid surface.",
    },
  },
  {
    key: "styled-outline",
    label: "Styled Outline",
    args: {
      variant: "styled",
      styleVariant: "outline",
      children: "Styled card with outline.",
    },
  },
  {
    key: "styled-ghost",
    label: "Styled Ghost",
    args: {
      variant: "styled",
      styleVariant: "ghost",
      children: "Styled card with ghost surface.",
    },
  },
] as const;

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    variant: "simple",
    styleVariant: "solid",
    pseudoState: "none",
    children: "Simple card content.",
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["simple", "header", "image", "actions", "styled"],
    },
    styleVariant: {
      control: { type: "select" },
      options: ["solid", "outline", "ghost"],
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    actions: { control: false },
    imageSrc: { control: false },
    imageAlt: { control: false },
    className: { control: false },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { children: "Simple card content." },
};

export const Header: Story = {
  args: {
    variant: "header",
    title: "Profile",
    subtitle: "User Details",
    children: "Card content",
  },
};

export const Image: Story = {
  args: {
    variant: "image",
    imageSrc: "https://via.placeholder.com/300x150",
    imageAlt: "Placeholder",
    children: "Content under image",
  },
};

export const Actions: Story = {
  args: {
    variant: "actions",
    title: "Confirm",
    children: "Are you sure?",
    actions: (
      <>
        <button className="rounded border border-neutral-200 bg-neutral-50 px-3 py-1 text-neutral-700">
          Cancel
        </button>
        <button className="rounded bg-neutral-900 px-3 py-1 text-neutral-50">
          OK
        </button>
      </>
    ),
  },
};

export const Styled: Story = {
  args: {
    variant: "styled",
    styleVariant: "outline",
    children: "Styled card with outline.",
  },
};

export const StyledSolid: Story = {
  args: {
    variant: "styled",
    styleVariant: "solid",
    children: "Styled card with solid surface.",
  },
};

export const StyledOutline: Story = {
  args: {
    variant: "styled",
    styleVariant: "outline",
    children: "Styled card with outline.",
  },
};

export const StyledGhost: Story = {
  args: {
    variant: "styled",
    styleVariant: "ghost",
    children: "Styled card with ghost surface.",
  },
};

export const AllVariants: Story = {
  args: {
    pseudoState: "none",
  },
  parameters: {
    layout: "padded",
  },
  render: (args: CardProps) => (
    <div className="grid w-full max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
      {matrixVariants.map((variant) => (
        <div
          key={variant.key}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">
            {variant.label}
          </p>
          <Card {...args} {...variant.args} />
        </div>
      ))}
    </div>
  ),
};

export const PseudoStatePreview: Story = {
  args: {
    variant: "header",
    title: "Weekly Summary",
    subtitle: "Team velocity",
    children: "Pseudo-state preview for card surfaces.",
    pseudoState: "none",
  },
  parameters: {
    layout: "padded",
  },
  render: (args: CardProps) => (
    <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stateMatrix.map(({ label, props }) => (
        <div
          key={label}
          className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm"
        >
          <p className="mb-3 text-sm font-semibold text-neutral-700">{label}</p>
          <Card {...args} {...props} />
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
            {matrixVariants.map((variant) => (
              <th
                key={variant.key}
                className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {variant.label}
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
              {matrixVariants.map((variant) => (
                <td key={`${label}-${variant.key}`} className="p-3 align-top">
                  <div className="min-w-[260px] rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                    <Card {...variant.args} {...props} />
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
