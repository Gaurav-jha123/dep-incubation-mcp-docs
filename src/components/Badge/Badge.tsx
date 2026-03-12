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
  default: "bg-secondary-200 text-secondary-900",
  success: "bg-success-200 text-success-900",
  warning: "bg-warning-200 text-warning-900",
  error: "bg-danger-200 text-danger-900",
  info: "bg-info-200 text-info-900",
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
          <Popover.Panel className="absolute z-10 mt-2 w-40 p-2 rounded border border-secondary-200 bg-secondary-50 text-sm text-secondary-900 shadow-lg">
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
