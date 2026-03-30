import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Toast, type ToastProps } from "./Toast";

const variantOptions = ["info", "success", "warning", "danger"] as const;
const sizeOptions = ["sm", "md", "lg"] as const;
const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const meta: Meta<typeof Toast> = {
  title: "Molecules/Toast",
  component: Toast,
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
      options: sizeOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    onClose: { action: "closed" },
  },
  args: {
    title: "System Notification",
    description: "A standard message for all dashboard alerts.",
    variant: "info",
    size: "md",
    pseudoState: "none",
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default toast with title and description."
      }
    }
  },
  args: {},
};

export const TitleOnly: Story = {
  parameters: {
    docs: {
      description: {
        story: "Toast with only a title."
      }
    }
  },
  args: {
    title: "Settings saved successfully.",
    description: undefined,
  },
};

export const WithoutCloseButton: Story = {
  parameters: {
    docs: {
      description: {
        story: "Toast without a close button."
      }
    }
  },
  args: {
    title: "Processing...",
    description: "Please wait while we update the dashboard.",
    onClose: undefined,
  },
};

export const Success: Story = {
  parameters: {
    docs: {
      description: {
        story: "Success toast for positive feedback."
      }
    }
  },
  args: {
    variant: "success",
    title: "Profile updated",
    description: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  parameters: {
    docs: {
      description: {
        story: "Warning toast for cautionary messages."
      }
    }
  },
  args: {
    variant: "warning",
    title: "Storage almost full",
    description: "You are approaching your workspace quota.",
  },
};

export const Danger: Story = {
  parameters: {
    docs: {
      description: {
        story: "Danger toast for error or failure messages."
      }
    }
  },
  args: {
    variant: "danger",
    title: "Login failed",
    description: "The email or password provided is incorrect.",
  },
};

export const VariantsAndStates: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Grid of all toast variants and pseudo states."
      }
    }
  },
  render: (args: ToastProps) => (
    <div className="grid gap-6 bg-neutral-50 p-8 md:grid-cols-2">
      {variantOptions.map((variant) => (
        <div key={variant} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium capitalize text-neutral-700">{variant}</p>
          {pseudoStateOptions.map((pseudoState) => (
            <Toast
              key={`${variant}-${pseudoState}`}
              {...args}
              variant={variant}
              pseudoState={pseudoState}
              title={`${variant.charAt(0).toUpperCase()}${variant.slice(1)} toast`}
              description={`Previewing the ${pseudoState} state.`}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

