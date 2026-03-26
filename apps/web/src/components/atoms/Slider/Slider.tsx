import React from 'react';

interface SliderProps {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    disabled = false,
    className = '',
    ariaLabel = 'Slider',
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <input
            type="range"
            value={value}
            aria-label={ariaLabel}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            onChange={handleChange}
            className={`slider ${className}`}
        />
    );
};
