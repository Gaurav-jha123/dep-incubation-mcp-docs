import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'error', 'success'],
    },
    inputSize: {
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
    placeholder: 'Enter some text...',
    label: 'Full Name',
  },
};

export const WithHelper: Story = {
  args: {
    placeholder: 'example@email.com',
    label: 'Email Address',
    helperText: 'We will never share your email with anyone',
    required: true,
  },
};

export const Error: Story = {
  args: {
    placeholder: 'Enter password',
    label: 'Password',
    variant: 'error',
    error: 'Password must be at least 8 characters',
    value: 'short',
  },
};

export const Success: Story = {
  args: {
    placeholder: 'Username',
    label: 'Username',
    variant: 'success',
    helperText: 'This username is available',
    value: 'johndoe',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    label: 'Disabled',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    label: 'Small Size',
    inputSize: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    label: 'Large Size',
    inputSize: 'lg',
  },
};

export const FullWidth: Story = {
  args: {
    placeholder: 'Full width input',
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
