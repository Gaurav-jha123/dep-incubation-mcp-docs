import React from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface BadgeProps {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
    info?: React.ReactNode; // optional popover content
    className?: string;
}

const variantClasses: Record<string, string> = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
};

export const Badge: React.FC<BadgeProps> = ({
    text,
    variant = 'default',
    info,
    className = '',
}) => {
    const baseClass = variantClasses[variant] || variantClasses.default;

    // If info prop is provided we show a headless-ui popover on hover/focus
    if (info) {
        return (
            <Popover className="relative inline-block">
                <Popover.Button
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded ${baseClass} ${className}`}
                >
                    {text}
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <Popover.Panel className="absolute z-10 mt-2 w-40 p-2 bg-white border rounded shadow-lg text-sm text-gray-700">
                        {info}
                    </Popover.Panel>
                </Transition>
            </Popover>
        );
    }

    return (
        <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${baseClass} ${className}`}
        >
            {text}
        </span>
    );
};
