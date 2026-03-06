import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    checked: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    onChange: fn(),
    label: 'Radio Option',
    size: 'md',
    disabled: false,
    checked: false,
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Radio
export const Default: Story = {};

// Checked Radio
export const Checked: Story = {
  args: {
    checked: true,
    label: 'Checked Radio',
  },
};

// Disabled Radio
export const Disabled: Story = {
  args: {
    disabled: true,
    label: 'Disabled Radio',
  },
};

// Small Radio
export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small Radio',
  },
};

// Large Radio
export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large Radio',
  },
};