import React from 'react';

interface TypographyProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption';
    children: React.ReactNode;
    className?: string;
}

const variantMap = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-bold',
    h3: 'text-2xl font-bold',
    h4: 'text-xl font-bold',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    body: 'text-base',
    caption: 'text-sm text-gray-600',
};

export const Typography: React.FC<TypographyProps> = ({
    variant = 'body',
    children,
    className = '',
}) => {
    const baseClass = variantMap[variant];

    return (
        <div className={`${baseClass} ${className}`}>
            {children}
        </div>
    );
};
