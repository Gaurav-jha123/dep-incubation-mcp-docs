import React from 'react';
import type { ReactNode } from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input variant style */
  variant?: 'default' | 'error' | 'success';
  /** Component size variant */
  inputSize?: 'sm' | 'md' | 'lg';
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Helper text */
  helperText?: string;
  /** Icon on the left side */
  leftIcon?: ReactNode;
  /** Icon on the right side */
  rightIcon?: ReactNode;
  /** Full width input */
  fullWidth?: boolean;
  /** Whether input is required */
  required?: boolean;
}

/** Reusable Input component with Tailwind CSS */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'default',
      inputSize = 'md',
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      required = false,
      className = '',
      disabled = false,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base styles
    const baseStyles =
      'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed';

    // Size styles
    const sizeStyles = {
      sm: 'px-2 py-1 text-sm rounded',
      md: 'px-3 py-2 text-base rounded-md',
      lg: 'px-4 py-3 text-lg rounded-lg',
    };

    // Variant styles
    const variantStyles = {
      default:
        'border border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:ring-blue-500 focus:border-blue-500',
      error:
        'border border-red-500 bg-red-50 text-gray-900 hover:border-red-600 focus:ring-red-500 focus:border-red-500',
      success:
        'border border-green-500 bg-green-50 text-gray-900 hover:border-green-600 focus:ring-green-500 focus:border-green-500',
    };

    // Container styles
    const containerClass = fullWidth ? 'w-full' : '';

    // Wrapper styles for icon support
    const wrapperStyles = 'relative flex items-center';

    const inputClass = [
      baseStyles,
      sizeStyles[inputSize],
      variantStyles[error ? 'error' : variant],
      leftIcon ? 'pl-10' : '',
      rightIcon ? 'pr-10' : '',
      containerClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const iconBaseClass = 'absolute top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none';
    const leftIconClass = leftIcon ? `left-3 ${iconBaseClass}` : '';
    const rightIconClass = rightIcon ? `right-3 ${iconBaseClass}` : '';

    const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
    const helperTextClass = 'block text-sm text-gray-500 mt-1';
    const errorClass = 'block text-sm text-red-500 font-medium mt-1';

    return (
      <div className={containerClass}>
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className={wrapperStyles}>
          {leftIcon && <span className={leftIconClass}>{leftIcon}</span>}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={inputClass}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />

          {rightIcon && <span className={rightIconClass}>{rightIcon}</span>}
        </div>

        {error && (
          <p id={`${inputId}-error`} className={errorClass}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={`${inputId}-helper`} className={helperTextClass}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
