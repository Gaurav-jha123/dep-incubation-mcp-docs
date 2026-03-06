import React from 'react';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, size = 'md', className = '', disabled = false, ...props }, ref) => {
    const sizeStyles = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const radioStyles =
      'text-blue-600 border-gray-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';

    const combinedClassName = [sizeStyles[size], radioStyles, className]
      .filter(Boolean)
      .join(' ');

    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="radio"
          disabled={disabled}
          className={combinedClassName}
          {...props}
        />
        {label && <span className="text-gray-800">{label}</span>}
      </label>
    );
  }
);

Radio.displayName = 'Radio';