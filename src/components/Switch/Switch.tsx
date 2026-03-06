import React from 'react';
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    disabled = false,
    className = '',
}) => {
    return (
        <HeadlessSwitch
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                checked ? 'bg-blue-500' : 'bg-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${
                    checked ? 'translate-x-5' : 'translate-x-1'
                }`}
            />
        </HeadlessSwitch>
    );
};
