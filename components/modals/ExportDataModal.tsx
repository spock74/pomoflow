import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/database';
import { Modal } from '../ui/Modal';
import { FileDown } from 'lucide-react';

interface ExportDataModalProps {
    onClose: () => void;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [exportDataUrl, setExportDataUrl] = useState<string | null>(null);

    useEffect(() => {
        const generateExport = async () => {
            try {
                const objetivos = await db.objetivos.toArray();
                const tarefas = await db.tarefas.toArray();
                const pomodoros = await db.pomodoros.toArray();
                
                const data = { objetivos, tarefas, pomodoros };
                
                const jsonString = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                setExportDataUrl(url);
            } catch (error) {
                console.error("Erro ao gerar exportação:", error);
            }
        };
        
        generateExport();

        return () => {
            if (exportDataUrl) {
                URL.revokeObjectURL(exportDataUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal title={t('modals.export.title')} onClose={onClose}>
            <p className="text-slate-400 mb-6">
                {t('modals.export.description')}
            </p>
            {exportDataUrl ? (
                <a
                    href={exportDataUrl}
                    download={`pomodoro_workflow_export_${new Date().toISOString().split('T')[0]}.json`}
                    className="w-full mt-4 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
                >
                    <FileDown size={18} /> {t('modals.export.downloadButton')}
                </a>
            ) : (
                <p className="text-slate-400">{t('modals.export.generating')}</p>
            )}
        </Modal>
    );
};