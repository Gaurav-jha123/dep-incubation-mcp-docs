import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./Textarea";

type TextareaStoryArgs = React.ComponentProps<typeof Textarea>;

const variantOptions = ["default", "success", "filled", "error"] as const;

const sizeOptions = ["sm", "md", "lg"] as const;

const sizeLabels: Record<(typeof sizeOptions)[number], string> = {
  sm: "Small",
  md: "Medium",
  lg: "Large",
};

const pseudoStateOptions = [
  "none",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const stateMatrix = [
  { label: "Default", props: { pseudoState: "none" as const } },
  { label: "Active", props: { pseudoState: "active" as const } },
  // { label: "Focus", props: { pseudoState: "focus" as const } },
  {
    label: "Focus Visible",
    props: { pseudoState: "focus-visible" as const },
  },
  { label: "Disabled", props: { pseudoState: "disabled" as const } },
] as const;

const meta: Meta<typeof Textarea> = {
  title: "Atoms/Textarea",
  component: Textarea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: variantOptions,
    },
    textareaSize: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    variant: "default",
    textareaSize: "md",
    pseudoState: "none",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter your message...",
    label: "Message",
  },
};

export const WithHelper: Story = {
  args: {
    placeholder: "Write something...",
    label: "Description",
    helperText: "Maximum 500 characters",
    required: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: "Enter description",
    label: "Description",
    variant: "error",
    error: "Description is required",
    value: "Too short",
  },
};

export const Success: Story = {
  args: {
    placeholder: "Enter details",
    label: "Details",
    variant: "success",
    helperText: "Looks good!",
    value: "Valid content",
    pseudoState: "active",
  },
};

export const Filled: Story = {
  args: {
    placeholder: "Start writing...",
    label: "Notes",
    variant: "filled",
    helperText: "Subtle filled surface for longer input.",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled textarea",
    label: "Disabled",
    disabled: true,
    value: "Cannot edit this",
  },
};

export const Small: Story = {
  args: {
    placeholder: "Small textarea",
    label: "Small Size",
    textareaSize: "sm",
  },
};

export const Large: Story = {
  args: {
    placeholder: "Large textarea",
    label: "Large Size",
    textareaSize: "lg",
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: "Full width textarea",
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

export const AllVariants: Story = {
  args: {
    pseudoState: "active",
    helperText: "Helper text",
  },

  render: (args: TextareaStoryArgs) => (
    <div className="space-y-8">
      {(["sm", "md", "lg"] as const).map((textareaSize) => (
        <div key={textareaSize} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-700">
            {textareaSize}
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            {variantOptions.map((variant) => (
              <Textarea
                key={`${textareaSize}-${variant}`}
                {...args}
                label={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} Textarea`}
                placeholder="Write a status update"
                textareaSize={textareaSize}
                variant={variant}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const PseudoStatePreview: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args: TextareaStoryArgs) => (
    <div className="grid gap-4 p-8 md:grid-cols-2 xl:grid-cols-5">
      {pseudoStateOptions.map((pseudoState) => (
        <div
          key={pseudoState}
          className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {pseudoState === "none" ? "Default" : pseudoState}
            </p>
          </div>

          <Textarea
            {...args}
            label="Message"
            placeholder="Write a status update"
            helperText="Helper text"
            pseudoState={pseudoState}
          />
        </div>
      ))}
    </div>
  ),
  args: {
    variant: "default",
    textareaSize: "md",
  },
};

export const VariantsAndStates: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => (
    <div className="space-y-8 p-8">
      {sizeOptions.map((textareaSize) => (
        <div key={textareaSize} className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-700">
            {sizeLabels[textareaSize]}
          </h3>
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
                  key={`${textareaSize}-${label}`}
                  className="border-t border-dashed border-neutral-200"
                >
                  <td className="sticky left-0 z-10 bg-neutral-50 p-3 text-sm font-medium text-neutral-700">
                    {label}
                  </td>
                  {variantOptions.map((variant) => (
                    <td
                      key={`${textareaSize}-${label}-${variant}`}
                      className="p-3 align-top"
                    >
                      <Textarea
                        label="Message"
                        placeholder="Write a status update"
                        helperText="Helper text"
                        textareaSize={textareaSize}
                        variant={variant}
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
