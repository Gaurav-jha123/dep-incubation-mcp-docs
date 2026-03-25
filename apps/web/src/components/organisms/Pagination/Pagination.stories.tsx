import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

type PaginationStoryProps = React.ComponentProps<typeof Pagination>;

const pseudoStateOptions = [
  'none',
  'hover',
  'active',
  'focus',
  'focus-visible',
  'disabled',
] as const;

const meta: Meta<typeof Pagination> = {
    title: "Organisms/Pagination",
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        pseudoState: {
            control: { type: 'select' },
            options: pseudoStateOptions,
        },
    },
    args: {
        pseudoState: 'none',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

const PaginationWrapper = (args: PaginationStoryProps) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
};

export const Default: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
};

export const MultiplePages: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 5,
        totalPages: 20,
    },
};

export const TwoPages: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 2,
    },
};

export const LastPage: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 10,
        totalPages: 10,
    },
};

const stateMatrix = [
    { label: 'Default', pseudoState: 'none' as const },
    { label: 'Hover', pseudoState: 'hover' as const },
    { label: 'Active', pseudoState: 'active' as const },
    { label: 'Focus', pseudoState: 'focus' as const },
    { label: 'Focus Visible', pseudoState: 'focus-visible' as const },
    { label: 'Disabled', pseudoState: 'disabled' as const },
];

export const States: Story = {
    parameters: {
        layout: 'padded',
    },
    render: (args: PaginationStoryProps) => (
        <div className="space-y-4">
            {stateMatrix.map((state) => (
                <div key={state.label} className="space-y-2">
                    <p className="text-sm font-medium text-neutral-700">{state.label}</p>
                    <PaginationWrapper {...args} pseudoState={state.pseudoState} />
                </div>
            ))}
        </div>
    ),
    args: {
        currentPage: 4,
        totalPages: 10,
    },
};
