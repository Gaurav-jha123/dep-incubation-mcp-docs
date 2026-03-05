import React from 'react';

interface BadgeProps {
    text: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
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
    className = '',
}) => {
    const baseClass = variantClasses[variant] || variantClasses.default;
    return (
        <span
            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${baseClass} ${className}`}
        >
            {text}
        </span>
    );
};
