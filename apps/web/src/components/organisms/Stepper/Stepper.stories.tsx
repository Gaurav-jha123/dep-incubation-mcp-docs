import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { userEvent } from "storybook/test";
import Stepper from "./Stepper";

const pseudoStateOptions = [
  "none",
  "hover",
  "active",
  "focus",
  "focus-visible",
  "disabled",
] as const;

const meta: Meta<typeof Stepper> = {
  title: "Organisms/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Stepper component built using Headless UI and Tailwind. Useful for multi-step flows like onboarding, forms, and checkout.",
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "minimal"],
    },
    currentStep: {
      control: { type: "number", min: 0, max: 3 },
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    pseudoStateTarget: {
      control: { type: "number", min: 0, max: 3 },
    },
    onChange: {
      control: false,
      table: { disable: true },
    },
  },
  args: {
    variant: "default",
    currentStep: 1,
    pseudoState: "none",
    pseudoStateTarget: 1,
  },
};

export default meta;

type Story = StoryObj<typeof Stepper>;
type StepperStoryArgs = React.ComponentProps<typeof Stepper>;

const steps = [
  { title: "Account" },
  { title: "Profile" },
  { title: "Billing" },
  { title: "Confirm" },
];

const stateMatrix = [
  { label: "Start", currentStep: 0 },
  { label: "In Progress", currentStep: 1 },
  { label: "Review", currentStep: 2 },
  { label: "Done", currentStep: 3 },
] as const;

const InteractiveStepper = (args: StepperStoryArgs) => {
  const [step, setStep] = useState(args.currentStep ?? 0);

  return (
    <div className="w-[700px] p-8">
      <Stepper {...args} currentStep={step} onChange={setStep} />
    </div>
  );
};

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Default stepper with four steps and interactive navigation."
      }
    }
  },
  args: {
    steps,
    variant: "default",
    currentStep: 1,
  },
  render: (args: StepperStoryArgs) => <InteractiveStepper {...args} />,
  play: async ({ canvas }) => {
    const billingTab = await canvas.findByRole("tab", { name: /billing/i });
    await userEvent.click(billingTab);

    const confirmTab = await canvas.findByRole("tab", { name: /confirm/i });
    await userEvent.click(confirmTab);
  },
};

export const Minimal: Story = {
  parameters: {
    docs: {
      description: {
        story: "Minimal stepper variant with four steps."
      }
    }
  },
  args: {
    steps,
    variant: "minimal",
    currentStep: 2,
  },
  render: (args: StepperStoryArgs) => <InteractiveStepper {...args} />,
  play: async ({ canvas }) => {
    const confirmTab = await canvas.findByRole("tab", { name: /confirm/i });
    await userEvent.click(confirmTab);

    const accountTab = await canvas.findByRole("tab", { name: /account/i });
    await userEvent.click(accountTab);
  },
};

export const States: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: "Stepper in all states and both variants."
      }
    }
  },
  args: {
    steps,
    variant: "default",
  },
  render: (args: StepperStoryArgs) => {
    const variants: StepperStoryArgs["variant"][] = ["default", "minimal"];

    return (
      <div className="space-y-8 p-8">
        {variants.map((variant) => (
          <div key={variant} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-600">
              {variant} variant
            </h3>
            <div className="space-y-4">
              {stateMatrix.map((state) => (
                <div key={`${variant}-${state.label}`} className="rounded-md border border-neutral-200 p-4">
                  <p className="mb-3 text-sm font-medium text-neutral-700">{state.label}</p>
                  <Stepper
                    {...args}
                    variant={variant}
                    currentStep={state.currentStep}
                    onChange={undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};