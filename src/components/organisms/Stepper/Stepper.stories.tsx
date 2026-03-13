import type { Meta, StoryObj } from "@storybook/react-vite";
import Stepper from "./Stepper";
import { useState } from "react";

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
  },
};

export default meta;

type Story = StoryObj<typeof Stepper>;

const steps = [
  { title: "Account" },
  { title: "Profile" },
  { title: "Billing" },
  { title: "Confirm" },
];

export const Default: Story = {
  args: {
    steps,
    variant: "default",
  },
  render: (args) => {
    const [step, setStep] = useState(1);
    return (
        <div className="w-[700px] p-8">
            <Stepper {...args} currentStep={step} onChange={setStep} />
        </div>
    )
  },
};

export const Minimal: Story = {
  args: {
    steps,
    variant: "minimal",
  },
  render: (args) => {
    const [step, setStep] = useState(2);
    return (
        <div className="w-[700px] p-8">
            <Stepper {...args} currentStep={step} onChange={setStep} />
        </div>
    )
  },
};