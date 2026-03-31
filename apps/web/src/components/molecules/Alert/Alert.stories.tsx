import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, type AlertPseudoState } from "./Alert";

type AlertStoryProps = React.ComponentProps<typeof Alert>;

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const typeOptions = ["info", "success", "warning", "error"] as const;

const stateMatrix = [
  { label: "Default",       pseudoState: "none" as const },
  { label: "Hover",         pseudoState: "hover" as const },
  { label: "Active",        pseudoState: "active" as const },
  { label: "Focus",         pseudoState: "focus" as const },
  { label: "Focus Visible", pseudoState: "focus-visible" as const },
  { label: "Disabled",      pseudoState: "disabled" as const },
];

const meta: Meta<typeof Alert> = {
  title: "Molecules/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "select" },
      options: typeOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    message: { control: "text" },
    closable: { control: "boolean" },
  },
  args: {
    pseudoState: "none",
    type: "info",
    closable: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Standard info alert.'
      }
    }
  },
  args: {
    type: "info",
    message: "This is an info alert.",
  },
};

export const Success: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Success alert for positive feedback.'
      }
    }
  },
  args: {
    type: "success",
    message: "Operation successful!",
  },
};

export const Error: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Error alert for failures or problems.'
      }
    }
  },
  args: {
    type: "error",
    message: "Something went wrong.",
  },
};

export const Warning: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Warning alert for cautionary messages.'
      }
    }
  },
  args: {
    type: "warning",
    message: "This is a warning alert.",
  },
};

export const Closable: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Alert with close (dismiss) button.'
      }
    }
  },
  render: (args: AlertStoryProps) => {
    const [visible, setVisible] = useState(true);
    return (
      <div style={{ minWidth: 360 }}>
        {visible && (
          <Alert {...args} closable onClose={() => setVisible(false)} />
        )}
      </div>
    );
  },
  args: {
    type: "info",
    message: "You can close this alert.",
  },
};

export const States: Story = {
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: 'Grid of all alert types and pseudo states.'
      }
    }
  },
  render: (args: AlertStoryProps) => (
    <div className="space-y-6" style={{ minWidth: 480 }}>
      {typeOptions.map((type) => (
        <div key={type} className="space-y-2">
          <p className="text-sm font-semibold capitalize text-neutral-700">{type}</p>
          <div className="space-y-1">
            {stateMatrix.map((state) => (
              <div key={state.label} className="flex items-center gap-4">
                <p className="w-28 shrink-0 text-xs font-medium text-neutral-700">
                  {state.label}
                </p>
                <Alert
                  {...args}
                  type={type}
                  pseudoState={state.pseudoState as AlertPseudoState}
                  closable
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
  args: {
    message: "Alert message example.",
  },
};
