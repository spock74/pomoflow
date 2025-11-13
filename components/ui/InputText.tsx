
import React from 'react';

interface InputTextProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
}

export const InputText: React.FC<InputTextProps> = ({ label, value, onChange, placeholder, required = false, maxLength }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
        </div>
    );
};