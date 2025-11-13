import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { useApiKeyStore } from '../../store/useApiKeyStore';
import { ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
    onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const { apiKey, setApiKey, clearApiKey } = useApiKeyStore();
    const [currentKey, setCurrentKey] = useState(apiKey || '');

    const handleSave = () => {
        setApiKey(currentKey);
        onClose();
    };
    
    const handleRemove = () => {
        clearApiKey();
        setCurrentKey('');
        onClose();
    };

    useEffect(() => {
        setCurrentKey(apiKey || '');
    }, [apiKey]);

    return (
        <Modal title={t('modals.apiKey.title')} onClose={onClose}>
            <div>
                <p className="text-slate-400 mb-4">{t('modals.apiKey.description')}</p>
                <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 mb-6"
                >
                    {t('modals.apiKey.getYourKey')} <ExternalLink size={14} />
                </a>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('modals.apiKey.inputLabel')}</label>
                    <input
                        type="password"
                        value={currentKey}
                        onChange={(e) => setCurrentKey(e.target.value)}
                        placeholder={t('modals.apiKey.inputPlaceholder')}
                        className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                    {apiKey && (
                        <button
                            onClick={handleRemove}
                            className="py-2 px-4 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
                        >
                            {t('modals.apiKey.removeButton')}
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={!currentKey}
                        className="py-2 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-all disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                        {t('modals.apiKey.saveButton')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
