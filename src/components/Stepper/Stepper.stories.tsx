import type { Meta, StoryObj } from "@storybook/react-vite";
import Stepper from "./Stepper";
import { useState } from "react";

const meta: Meta<typeof Stepper> = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],

  parameters: {
    docs: {
      description: {
        component:
          "Stepper component built using Headless UI and Tailwind. It helps users navigate through multi-step processes like forms, onboarding, or checkout flows.",
      },
    },
    layout: "centered",
  },
  argTypes: {
    currentStep: {
      description: "Current active step index",
      control: { type: "number" },
    },
    variant: {
      description: "Visual variant of the stepper",
      control: { type: "radio" },
      options: ["default", "minimal"],
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
      <Stepper {...args} currentStep={step} onChange={setStep} />
    );
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
      <Stepper {...args} currentStep={step} onChange={setStep} />
    );
  },
};