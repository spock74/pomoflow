import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { InputText } from '../ui/InputText';
import { Coffee } from 'lucide-react';

interface PomodoroReviewModalProps {
    onSave: (reviewData: {
        qualidade: number;
        distratores: string;
        notas: string;
        codigoPessoal: string;
    }) => void;
    onClose: () => void;
}

export const PomodoroReviewModal: React.FC<PomodoroReviewModalProps> = ({ onSave, onClose }) => {
    const { t } = useTranslation();
    const [qualidade, setQualidade] = useState(4);
    const [distratores, setDistratores] = useState('');
    const [notas, setNotas] = useState('');
    const [codigoPessoal, setCodigoPessoal] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ qualidade, distratores, notas, codigoPessoal });
    };

    return (
        <Modal title={t('modals.pomodoroReview.title')} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <p className="text-slate-400 mb-6">{t('modals.pomodoroReview.description')}</p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">{t('modals.pomodoroReview.qualityLabel')}</label>
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((q) => (
                            <button
                                key={q}
                                type="button"
                                onClick={() => setQualidade(q)}
                                className={`w-12 h-12 rounded-full font-bold text-lg transition-all ${
                                    qualidade === q 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                <InputText
                    label={t('modals.pomodoroReview.distractorsLabel')}
                    value={distratores}
                    onChange={setDistratores}
                    placeholder={t('modals.pomodoroReview.distractorsPlaceholder')}
                />
                <InputText
                    label={t('modals.pomodoroReview.notesLabel')}
                    value={notas}
                    onChange={setNotas}
                    placeholder={t('modals.pomodoroReview.notesPlaceholder')}
                />
                <InputText
                    label={t('modals.pomodoroReview.codeLabel')}
                    value={codigoPessoal}
                    onChange={setCodigoPessoal}
                    placeholder={t('modals.pomodoroReview.codePlaceholder')}
                    maxLength={3}
                />

                <button
                    type="submit"
                    className="w-full mt-6 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                >
                    <Coffee size={18} /> {t('modals.pomodoroReview.saveButton')}
                </button>
            </form>
        </Modal>
    );
};