import type { Meta, StoryObj } from '@storybook/react-vite';

import Loader from './Loader';

const meta = {
  title: "Atoms/Loader",
  component: Loader,
  parameters: {
    layout: 'centered',
    a11y: {
      config: {
        rules: [
          {
            id: 'aria-hidden-focus',
            enabled: false,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the loader dialog is open',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the loader spinner',
    },
    color: {
      control: { type: 'select' },
      options: ['blue'],
      description: 'Color of the loader spinner',
    },
  },
  args: {
    open: true,
    size: 'medium',
    color: 'blue',
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default loader state */
export const Default: Story = {};

/** Small size loader */
export const Small: Story = {
  args: {
    size: 'small',
  },
};

/** Large size loader */
export const Large: Story = {
  args: {
    size: 'large',
  },
};

export const Blue: Story = {
  args: {
    color: 'blue',
  },
};
  