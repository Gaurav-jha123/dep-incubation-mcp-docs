import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'error', 'success'] },
    selectSize: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { label: 'Option One', value: 'one' },
  { label: 'Option Two', value: 'two' },
  { label: 'Option Three', value: 'three' },
];

export const Default: Story = {
  args: {
    label: 'Select Option',
    options: sampleOptions,
    value: 'one',
    onChange: () => {},
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Select Country',
    options: sampleOptions,
    value: 'one',
    helperText: 'Choose the appropriate option',
    required: true,
    onChange: () => {},
  },
};

export const Error: Story = {
  args: {
    label: 'Select Role',
    options: sampleOptions,
    value: 'one',
    variant: 'error',
    error: 'Please select a valid role',
    onChange: () => {},
  },
};

export const Success: Story = {
  args: {
    label: 'Username Availability',
    options: sampleOptions,
    value: 'three',
    variant: 'success',
    helperText: 'This selection is valid',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: sampleOptions,
    value: 'two',
    disabled: true,
    onChange: () => {},
  },
};

export const Small: Story = {
  args: {
    label: 'Small Select',
    options: sampleOptions,
    selectSize: 'sm',
    value: 'one',
    onChange: () => {},
  },
};

export const Large: Story = {
  args: {
    label: 'Large Select',
    options: sampleOptions,
    selectSize: 'lg',
    value: 'two',
    onChange: () => {},
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Select',
    options: sampleOptions,
    value: 'one',
    fullWidth: true,
    onChange: () => {},
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    required: true,
    options: sampleOptions,
    value: 'one',
    helperText: 'This field is mandatory',
    onChange: () => {},
  },
};