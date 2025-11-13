
import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg m-4 border border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};
