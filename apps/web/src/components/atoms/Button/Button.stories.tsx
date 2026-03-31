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
  parameters: {
    docs: {
      description: {
        story: "Primary button for main actions."
      }
    }
  },
  args: {
    variant: "primary",
    children: "Primary Button",
    onClick: fn(),
  },
  play: async (context: StoryContext<ButtonProps>) => {
    const { canvas, args } = context;
    const button = await canvas.findByRole("button", {
      name: /primary button/i,
    });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Secondary: Story = {
  parameters: {
    docs: {
      description: {
        story: "Secondary button for less prominent actions."
      }
    }
  },
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Danger: Story = {
  parameters: {
    docs: {
      description: {
        story: "Danger button for destructive or irreversible actions."
      }
    }
  },
  args: {
    variant: "danger",
    children: "Delete",
  },
};

export const Ghost: Story = {
  parameters: {
    docs: {
      description: {
        story: "Ghost button for minimal, low-emphasis actions."
      }
    }
  },
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Outline: Story = {
  parameters: {
    docs: {
      description: {
        story: "Outline button for secondary or alternative actions."
      }
    }
  },
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Link: Story = {
  parameters: {
    docs: {
      description: {
        story: "Text button for inline or less-pronounced actions."
      }
    }
  },
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: "Large button for high-visibility actions."
      }
    }
  },
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const Medium: Story = {
  parameters: {
    docs: {
      description: {
        story: "Medium button for standard actions."
      }
    }
  },
  args: {
    size: "md",
    children: "Medium Button",
  },
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: "Small button for compact or dense layouts."
      }
    }
  },
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Disabled: Story = {
  parameters: {
    docs: {
      description: {
        story: "Disabled button for unavailable or inactive actions."
      }
    }
  },
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};

export const Loading: Story = {
  parameters: {
    docs: {
      description: {
        story: "Button in loading state, shows spinner and disables interaction."
      }
    }
  },
  args: {
    isLoading: true,
    children: "Loading...",
  },
};

export const WithIcon: Story = {
  parameters: {
    docs: {
      description: {
        story: "Button with an icon and text for visual emphasis."
      }
    }
  },
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
  parameters: {
    docs: {
      description: {
        story: "Displays all button variants for comparison."
      }
    }
  },
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
  parameters: {
    docs: {
      description: {
        story: "Test real hover behavior on buttons. No pseudo state is forced."
      }
    },
    layout: "padded",
  },
  args: {
    pseudoState: "none",
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
    docs: {
      description: {
        story: "Matrix of all button variants, sizes, and pseudo states for comprehensive visual testing."
      }
    },
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

