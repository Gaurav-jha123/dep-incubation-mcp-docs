import type { Meta, StoryObj } from "@storybook/react-vite";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const HorizontalSmall: Story = {
  parameters: {
    docs: {
      description: {
        story: "A small horizontal divider for subtle content separation."
      }
    }
  },
  args: {
    orientation: "horizontal",
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const HorizontalMedium: Story = {
  parameters: {
    docs: {
      description: {
        story: "A medium horizontal divider for standard content separation."
      }
    }
  },
  args: {
    orientation: "horizontal",
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const HorizontalLarge: Story = {
  parameters: {
    docs: {
      description: {
        story: "A large horizontal divider for prominent content separation."
      }
    }
  },
  args: {
    orientation: "horizontal",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4 w-[300px]">
        <div className="text-sm">Content Above</div>
        <Story />
        <div className="text-sm">Content Below</div>
      </div>
    ),
  ],
};

export const VerticalSmall: Story = {
  parameters: {
    docs: {
      description: {
        story: "A small vertical divider for subtle side-by-side separation."
      }
    }
  },
  args: {
    orientation: "vertical",
    size: "sm",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const VerticalMedium: Story = {
  parameters: {
    docs: {
      description: {
        story: "A medium vertical divider for standard side-by-side separation."
      }
    }
  },
  args: {
    orientation: "vertical",
    size: "md",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};

export const VerticalLarge: Story = {
  parameters: {
    docs: {
      description: {
        story: "A large vertical divider for prominent side-by-side separation."
      }
    }
  },
  args: {
    orientation: "vertical",
    size: "lg",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-[50px]">
        <div className="text-sm">Left Content</div>
        <Story />
        <div className="text-sm">Right Content</div>
      </div>
    ),
  ],
};
