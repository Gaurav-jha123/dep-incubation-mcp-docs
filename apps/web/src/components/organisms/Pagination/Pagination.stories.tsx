import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { within, userEvent } from '@storybook/testing-library';
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

const stateMatrix = [
    { label: 'Default', pseudoState: 'none' as const },
    { label: 'Hover', pseudoState: 'hover' as const },
    { label: 'Active', pseudoState: 'active' as const },
    { label: 'Focus', pseudoState: 'focus' as const },
    { label: 'Focus Visible', pseudoState: 'focus-visible' as const },
    { label: 'Disabled', pseudoState: 'disabled' as const },
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
        currentPage: {
            control: { type: 'number', min: 1 },
        },
        totalPages: {
            control: { type: 'number', min: 1 },
        },
    },
    args: {
        pseudoState: 'none',
        currentPage: 1,
        totalPages: 10,
    },
};

export default meta;
type Story = StoryObj<typeof meta>;
// type PaginationStoryArgs = ComponentProps<typeof Pagination>

const PaginationWrapper = (args: React.ComponentProps<typeof Pagination>) => {
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

export const Interactive: Story = {
    parameters: {
        layout: 'padded',
    },
    render: (args: PaginationStoryProps) => (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
            <p className="text-sm text-neutral-700">
                Use this story to test real interactions. No pseudo state is forced.
            </p>
            <PaginationWrapper {...args} pseudoState="none" />
        </div>
    ),
    args: {
        currentPage: 4,
        totalPages: 10,
    },
};

export const States: Story = {
    parameters: {
        layout: 'padded',
    },
    render: (args: PaginationStoryProps) => (
        <div className="space-y-4">
            {stateMatrix.map((state) => (
                <div key={state.label} className="space-y-2">
                    <p className="text-sm font-medium text-neutral-700">{state.label}</p>
                    <PaginationWrapper
                        {...args}
                        pseudoState={state.pseudoState}
                        navAriaLabel={`Pagination ${state.label}`}
                    />
                </div>
            ))}
        </div>
    ),
    args: {
        currentPage: 4,
        totalPages: 10,
    },
};

export const ClickNext: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByText('Next');

        await userEvent.click(nextButton);

        const page2Button = canvas.getByText('2');
        if (!page2Button.className.includes('bg-primary-500')) {
            throw new Error('Page 2 should be active after clicking Next');
        }
    },
};

export const ClickPrevious: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 5,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const prevButton = canvas.getByText('Previous');

        await userEvent.click(prevButton);

        const page4Button = canvas.getByText('4');
        if (!page4Button.className.includes('bg-primary-500')) {
            throw new Error('Page 4 should be active after clicking Previous');
        }
    },
};

export const ClickSpecificPage: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);

        await userEvent.click(canvas.getByText('3'));

        const page3Button = canvas.getByText('3');
        if (!page3Button.className.includes('bg-primary-500')) {
            throw new Error('Page 3 should be active after clicking it');
        }
    },
};

export const NavigateMultipleSteps: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByText('Next');
        const prevButton = canvas.getByText('Previous');

        await userEvent.click(nextButton);
        await userEvent.click(nextButton);
        await userEvent.click(nextButton);
        await userEvent.click(prevButton);

        const page3Button = canvas.getByText('3');
        if (!page3Button.className.includes('bg-primary-500')) {
            throw new Error('Page 3 should be active after 3 Nexts and 1 Previous');
        }
    },
};

export const FirstPageBoundary: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const prevButton = canvas.getByText('Previous');
        const nextButton = canvas.getByText('Next');

        if (!prevButton.hasAttribute('disabled')) {
            throw new Error('Previous should be disabled on page 1');
        }

        await userEvent.click(nextButton);

        if (prevButton.hasAttribute('disabled')) {
            throw new Error('Previous should be enabled after navigating to page 2');
        }
    },
};

export const LastPageBoundary: Story = {
    render: (args: PaginationStoryProps) => <PaginationWrapper {...args} pseudoState="none" />,
    args: {
        currentPage: 10,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByText('Next');
        const prevButton = canvas.getByText('Previous');

        if (!nextButton.hasAttribute('disabled')) {
            throw new Error('Next should be disabled on the last page');
        }

        await userEvent.click(prevButton);

        if (nextButton.hasAttribute('disabled')) {
            throw new Error('Next should be enabled after navigating to page 9');
        }
    },
};