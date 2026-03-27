import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";
import { Button } from "../../atoms/Button/Button";
import { Modal, type ModalProps } from "./Modal";

const sizeOptions = ["sm", "md", "lg", "xl"] as const;
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

const meta = {
  title: "Organisms/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: { type: "select" },
      options: sizeOptions,
    },
    pseudoState: {
      control: { type: "select" },
      options: pseudoStateOptions,
    },
    title: {
      control: "text",
    },
    description: {
      control: "text",
    },
    showCancelButton: {
      control: "boolean",
    },
    className: {
      control: "text",
    },
    footer: {
      control: false,
    },
    isOpen: {
      control: false,
      table: { disable: true },
    },
    onClose: {
      control: false,
      table: { disable: true },
    },
  },
  args: {
    title: "Profile Info",
    description: "This is your profile modal",
    children: "Hello from inside the modal!",
    size: "md",
    pseudoState: "none",
    showCancelButton: true,
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;
type ModalStoryArgs = Omit<ModalProps, "isOpen">;

const ModalWithTrigger = (args: ModalStoryArgs) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    args.onClose?.();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={open} onClose={handleClose} />
    </>
  );
};

const renderWithTrigger = (args: ModalStoryArgs) => (
  <ModalWithTrigger {...args} />
);

export const Default: Story = {
  render: renderWithTrigger,
  args: {
    onClose: fn(),
    isOpen: false
  },
};

export const WithFooterActions: Story = {
  render: renderWithTrigger,
  args: {
    title: "Delete Account",
    description: "Are you sure you want to delete your account?",
    footer: (
      <>
        <Button variant="outline">Cancel</Button>
        <Button variant="danger">Delete</Button>
      </>
    ),
    children: "This action cannot be undone.",
    onClose: fn(),
    isOpen: false
  },
};

export const LargeModal: Story = {
  render: renderWithTrigger,
  args: {
    size: "lg",
    title: "Large Modal",
    description: "This modal uses the large size",
    children: "This modal is wider than the default modal.",
    onClose: fn(),
    isOpen: false
  },
};

export const ExtraLargeModal: Story = {
  render: renderWithTrigger,
  args: {
    size: "xl",
    title: "XL Modal",
    description: "Useful for long forms or complex content.",
    children: "This variant gives you the maximum content area.",
    onClose: fn(),
    isOpen: false
  },
};

export const ScrollableContent: Story = {
  render: renderWithTrigger,
  args: {
    title: "Scrollable Modal",
    children: (
      <div className="max-h-64 space-y-4 overflow-y-auto">
        {Array.from({ length: 20 }).map((_, index) => (
          <p key={index}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        ))}
      </div>
    ),
    onClose: fn(),
    isOpen: false
  },
};

export const States: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: (args: ModalStoryArgs) => (
    <div className="space-y-6 p-8">
      {stateMatrix.map(({ label, props }) => (
        <div key={label} className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">{label}</p>
          <ModalWithTrigger {...args} {...props} />
        </div>
      ))}
    </div>
  ),
  args: {
    onClose: fn(),
    isOpen: false
  },
};