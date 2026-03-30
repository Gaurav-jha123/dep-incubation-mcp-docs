import type { Meta, StoryObj } from '@storybook/react-vite';

import Loader from './Loader';

// Inline spinner for docs mode
type LoaderInlineProps = { size?: 'small' | 'medium' | 'large' };
const sizeClasses: Record<string, string> = {
  small: 'h-6 w-6 border-2',
  medium: 'h-12 w-12 border-4',
  large: 'h-16 w-16 border-4',
};
function LoaderInline({ size = 'medium' }: LoaderInlineProps) {
  return (
    <div className="flex items-center justify-center">
      <div
        data-testid="loader-spinner"
        className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: 'var(--color-primary-500)', borderTopColor: 'transparent' }}
      ></div>
    </div>
  );
}

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
    open: false,
    size: 'medium',
    color: 'blue',
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "A loader spinner for indicating loading state."
      }
    }
  },
  args: {
    open: true,
  },
  render: (args, { viewMode }) =>
    viewMode === 'docs' ? <LoaderInline size={args.size} /> : <Loader {...args} />,
};

export const Small: Story = {
  parameters: {
    docs: {
      description: {
        story: "Small loader spinner for compact areas."
      }
    }
  },
  args: {
    size: 'small',
    open: true,
  },
  render: (args, { viewMode }) =>
    viewMode === 'docs' ? <LoaderInline size={args.size} /> : <Loader {...args} />,
};

export const Large: Story = {
  parameters: {
    docs: {
      description: {
        story: "Large loader spinner for prominent loading states."
      }
    }
  },
  args: {
    size: 'large',
    open: true,
  },
  render: (args, { viewMode }) =>
    viewMode === 'docs' ? <LoaderInline size={args.size} /> : <Loader {...args} />,
};

// Pseudo states for demonstration (last story)
const pseudoStates = [
  { label: 'Default', className: '' },
  { label: 'Hover', className: 'hover:border-primary-700' },
  { label: 'Active', className: 'active:border-primary-900' },
  { label: 'Focus', className: 'focus:border-primary-400' },
  { label: 'Disabled', className: 'opacity-50 pointer-events-none' },
];

export const PseudoStates: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Loader spinner with various pseudo states (visual only, not interactive).',
      },
    },
    layout: 'centered',
  },
  render: () => (
    <div className="flex gap-8 items-center justify-center">
      {pseudoStates.map(({ label, className }) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <span className="text-xs text-neutral-500">{label}</span>
          <div
            data-testid="loader-spinner"
            className={`h-12 w-12 border-4 border-t-transparent rounded-full animate-spin ${className}`}
            style={{ borderColor: 'var(--color-primary-500)', borderTopColor: 'transparent' }}
          ></div>
        </div>
      ))}
    </div>
  ),
};
  