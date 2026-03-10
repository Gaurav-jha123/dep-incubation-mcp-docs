import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    textareaSize: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter your message...',
    label: 'Message',
  },
};

export const WithHelper: Story = {
  args: {
    placeholder: 'Write something...',
    label: 'Description',
    helperText: 'Maximum 500 characters',
    required: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Enter description',
    label: 'Description',
    variant: 'error',
    error: 'Description is required',
    value: 'Too short',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Enter details',
    label: 'Details',
    variant: 'success',
    helperText: 'Looks good!',
    value: 'Valid content',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled textarea',
    label: 'Disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small textarea',
    label: 'Small Size',
    textareaSize: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large textarea',
    label: 'Large Size',
    textareaSize: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: 'Full width textarea',
    label: 'Full Width',
    fullWidth: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: 'Required field',
    label: 'Required Field',
    required: true,
    helperText: 'This field is mandatory',
  },
};