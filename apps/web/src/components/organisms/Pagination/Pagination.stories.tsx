import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { Pagination } from './Pagination';

type PaginationProps = React.ComponentProps<typeof Pagination>;

const meta: Meta<typeof Pagination> = {
    title: "Organisms/Pagination",
    component: Pagination,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const PaginationWrapper = (args: React.ComponentProps<typeof Pagination>) => {
    const [currentPage, setCurrentPage] = useState(args.currentPage);
    return <Pagination {...args} currentPage={currentPage} onPageChange={setCurrentPage} />;
};

export const Default: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
};

export const MultiplePages: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 5,
        totalPages: 20,
    },
};

export const TwoPages: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 2,
    },
};

export const LastPage: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 10,
        totalPages: 10,
    },
};

/** Clicks Next and verifies page 2 becomes active */
export const ClickNext: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
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

/** Clicks Previous and verifies page 4 becomes active */
export const ClickPrevious: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
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

/** Clicks a specific page number and verifies it becomes active */
export const ClickSpecificPage: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
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

/** Navigates forward 3 times, then back once — page 3 should be active */
export const NavigateMultipleSteps: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
    args: {
        currentPage: 1,
        totalPages: 10,
    },
    play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
        const canvas = within(canvasElement);
        const nextButton = canvas.getByText('Next');
        const prevButton = canvas.getByText('Previous');

        await userEvent.click(nextButton); // → page 2
        await userEvent.click(nextButton); // → page 3
        await userEvent.click(nextButton); // → page 4
        await userEvent.click(prevButton); // → page 3

        const page3Button = canvas.getByText('3');
        if (!page3Button.className.includes('bg-primary-500')) {
            throw new Error('Page 3 should be active after 3 Nexts and 1 Previous');
        }
    },
};

/** Verifies Previous is disabled on page 1 and enabled after navigating forward */
export const FirstPageBoundary: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
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

/** Verifies Next is disabled on last page and enabled after navigating back */
export const LastPageBoundary: Story = {
    render: (args: PaginationProps) => <PaginationWrapper {...args} />,
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