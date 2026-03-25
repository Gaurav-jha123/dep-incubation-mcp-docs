import type { Meta, StoryObj } from "@storybook/react-vite";

import { Typography, type TypographyVariant } from "./Typography";

type TypographyStoryArgs = React.ComponentProps<typeof Typography>;

const variantOptions: TypographyVariant[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body",
  "caption",
  "lead",
  "overline",
];

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

const variantSampleText: Record<TypographyVariant, string> = {
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  body: "Body copy",
  caption: "Caption text",
  lead: "Lead paragraph",
  overline: "Overview",
};

const meta: Meta<typeof Typography> = {
  title: "Atoms/Typography",
  component: Typography,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variantOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    collapsible: {
      control: "boolean",
    },
  },
  args: {
    variant: "body",
    pseudoState: "none",
    collapsible: false,
    children: "Typography sample",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TypographyScale: Story = {
  args: {
    pseudoState: "hover",
  },

  render: (args: TypographyStoryArgs) => (
    <div className="space-y-4">
      <Typography {...args} variant="overline">
        Section label
      </Typography>
      <Typography {...args} variant="h1">
        Heading 1 - 36px, bold-700
      </Typography>
      <Typography {...args} variant="h2">
        Heading 2 - 30px, bold-700
      </Typography>
      <Typography {...args} variant="h3">
        Heading 3 - 24px, bold-700
      </Typography>
      <Typography {...args} variant="h4">
        Heading 4 - 20px, bold-700
      </Typography>
      <Typography {...args} variant="h5">
        Heading 5 - 18px, semibold-600
      </Typography>
      <Typography {...args} variant="h6">
        Heading 6 - 16px, semibold-600
      </Typography>
      <Typography {...args} variant="lead">
        Lead paragraph - 18px, relaxed tone
      </Typography>
      <Typography {...args} variant="body">
        Body - 16px, normal-400
      </Typography>
      <Typography {...args} variant="caption">
        Caption - 14px normal-400
      </Typography>
    </div>
  ),

  parameters: {
    docs: {
      description: {
        story:
          "All typography variants in one place with size, weight, and tone.",
      },
    },
  },
};

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1: font-size 36px, font-weight 700 (bold)",
    pseudoState: "none",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2: font-size 30px, font-weight 700 (bold)",
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3: font-size 24px, font-weight 700 (bold)",
  },
};

export const Heading4: Story = {
  args: {
    variant: "h4",
    children: "Heading 4: font-size 20px, font-weight 700 (bold)",
  },
};

export const Heading5: Story = {
  args: {
    variant: "h5",
    children: "Heading 5: font-size 18px, font-weight 600 (semi-bold)",
  },
};

export const Lead: Story = {
  args: {
    variant: "lead",
    children: "Lead copy for intro paragraphs and section summaries.",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    children: "body: font-size 16px, font-weight 400 (normal)",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "caption: font-size 14px, font-weight 400 (normal)",
  },
};

export const Overline: Story = {
  args: {
    variant: "overline",
    children: "Overview",
  },
};

export const CollapsibleHeading: Story = {
  args: {
    variant: "h3",
    children: "Click to expand",
    collapsible: true,
  },
};

export const AllVariants: Story = {
  args: {
    pseudoState: "none",
    collapsible: false,
  },
  render: (args: TypographyStoryArgs) => (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      {variantOptions.map((variant) => (
        <div key={variant} className="space-y-1">
          <Typography variant="overline">{variant}</Typography>
          <Typography
            variant={variant}
            pseudoState={args.pseudoState}
            collapsible={args.collapsible && variant === "h3"}
          >
            {variantSampleText[variant]}
          </Typography>
        </div>
      ))}
    </div>
  ),
};

export const StatePreviews: Story = {
  args: {
    pseudoState: "hover",
    collapsible: false,
  },
  render: (args: TypographyStoryArgs) => (
    <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
      <div className="space-y-1">
        <Typography variant="overline">{args.pseudoState ?? "none"}</Typography>
        <Typography variant="h4" pseudoState={args.pseudoState}>
          Project readiness summary
        </Typography>
        <Typography variant="body" pseudoState={args.pseudoState}>
          Typography pseudo states are intended for design review and Storybook
          previews.
        </Typography>
      </div>
    </div>
  ),
};

export const VariantsAndStates: Story = {
  args: {
    variant: "h2",
    pseudoState: "focus",
  },

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
                className="p-3 text-center text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {variant}
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
                  <Typography variant={variant} {...props}>
                    {variantSampleText[variant]}
                  </Typography>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};
