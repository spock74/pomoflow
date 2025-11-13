import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, RotateCcw, Coffee, Settings } from 'lucide-react';
import { ICurrentTarefa, IObjetivo } from '../types';

interface HeaderProps {
    timer: number;
    isRunning: boolean;
    timerType: 'trabalho' | 'pausa';
    currentTarefa: ICurrentTarefa | null;
    objetivoAtual: IObjetivo | null | undefined;
    onPause: () => void;
    onReset: () => void;
    onSettingsClick: () => void;
}

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const Header: React.FC<HeaderProps> = ({ timer, isRunning, timerType, currentTarefa, objetivoAtual, onPause, onReset, onSettingsClick }) => {
    const { t } = useTranslation();
    
    return (
        <header className={`w-full p-4 flex flex-col items-center shadow-lg transition-colors duration-300 ${
            timerType === 'trabalho' ? 'bg-slate-800' : 'bg-emerald-800'
        }`}>
            <h1 className="text-5xl font-bold text-white mb-2">{formatTime(timer)}</h1>
            <div className="flex space-x-4 mb-3">
                <button onClick={onPause} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-all" aria-label={isRunning ? 'Pause' : 'Play'}>
                    {isRunning ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={onReset} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-all" aria-label="Reset">
                    <RotateCcw size={20} />
                </button>
                <button onClick={onSettingsClick} className="p-2 bg-slate-700 rounded-full hover:bg-slate-600 transition-all" aria-label="Settings">
                    <Settings size={20} />
                </button>
            </div>
            <div className="h-6 text-center">
                {currentTarefa && objetivoAtual && (
                    <span className="text-sm text-slate-300 px-3 py-1 bg-slate-700 rounded-full">
                        {t('header.focus', { objectiveName: objetivoAtual.nome, taskName: currentTarefa.nome })}
                    </span>
                )}
                {!currentTarefa && timerType === 'pausa' && (
                    <span className="text-sm text-emerald-200 px-3 py-1 bg-emerald-600 rounded-full flex items-center gap-2">
                        <Coffee size={14} /> {t('header.break')}
                    </span>
                )}
            </div>
        </header>
    );
};