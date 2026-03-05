import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal } from "./Modal";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Profile Info"
        description="This is your profile modal"
        footer={
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Close
          </button>
        }
      >
        Hello from inside the modal!
      </Modal>
    );
  },
};
