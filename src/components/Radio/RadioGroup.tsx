import React, { useState } from 'react';
import { Radio } from './Radio';

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  defaultValue,
  onChange,
  size = 'md',
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');

  const selectedValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`} data-testid="radio-group-wrapper">
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          label={option.label}
          disabled={option.disabled}
          size={size}
          checked={selectedValue === option.value}
          onChange={() => handleChange(option.value)}
        />
      ))}
    </div>
  );
};