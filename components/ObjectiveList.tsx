import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/database';
import { ITarefa } from '../types';
import { ObjectiveItem } from './ObjectiveItem';

interface ObjectiveListProps {
    onStartTarefa: (tarefa: ITarefa) => void;
    onToggleTarefa: (tarefa: ITarefa) => void;
    isTimerRunning: boolean;
}

export const ObjectiveList: React.FC<ObjectiveListProps> = ({ onStartTarefa, onToggleTarefa, isTimerRunning }) => {
    const { t } = useTranslation();
    const objetivos = useLiveQuery(() => db.objetivos.orderBy('data').reverse().toArray(), []);

    if (!objetivos) {
        return <div className="text-center text-slate-400">{t('objectiveList.loading')}</div>;
    }

    if (objetivos.length === 0) {
        return (
            <div className="text-center text-slate-400 p-8 bg-slate-800 rounded-lg">
                {t('objectiveList.empty')}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {objetivos.map((objetivo) => (
                <ObjectiveItem 
                    key={objetivo.id} 
                    objetivo={objetivo}
                    onStartTarefa={onStartTarefa}
                    onToggleTarefa={onToggleTarefa}
                    isTimerRunning={isTimerRunning}
                />
            ))}
        </div>
    );
};