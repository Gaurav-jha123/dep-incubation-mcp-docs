import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Organisms/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;
type ModalStoryArgs = React.ComponentProps<typeof Modal>;

export const Default: Story = {
  render: (args: ModalStoryArgs) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal
        </button>

        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: "Profile Info",
    description: "This is your profile modal",
    children: "Hello from inside the modal!",
  },
};

export const WithFooterActions: Story = {
  render: (args: ModalStoryArgs) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal
        </button>

        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: "Delete Account",
    description: "Are you sure you want to delete your account?",
    footer: (
      <>
        <button className="px-3 py-1 border rounded">
          Cancel
        </button>
        <button className="px-3 py-1 bg-red-600 text-white rounded">
          Delete
        </button>
      </>
    ),
    children: "This action cannot be undone.",
  },
};

export const LargeModal: Story = {
  render: (args: ModalStoryArgs) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal
        </button>

        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    size: "lg",
    title: "Large Modal",
    description: "This modal uses the large size",
    children: "This modal is wider than the default modal.",
  },
};

export const ScrollableContent: Story = {
  render: (args: ModalStoryArgs) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal
        </button>

        <Modal
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: "Scrollable Modal",
    children: (
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        ))}
      </div>
    ),
  },
};