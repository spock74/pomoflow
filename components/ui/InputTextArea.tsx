
import React from 'react';

interface InputTextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
}

export const InputTextArea: React.FC<InputTextAreaProps> = ({ label, value, onChange, placeholder, rows = 3 }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
        </div>
    );
};