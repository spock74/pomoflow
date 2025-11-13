import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTranslation } from 'react-i18next';
import { db } from './services/database';
import { ICurrentTarefa, ITarefa } from './types';
import { useApiKeyStore } from './store/useApiKeyStore';

import { Header } from './components/Header';
import { ObjectiveList } from './components/ObjectiveList';
import { PomodoroReviewModal } from './components/modals/PomodoroReviewModal';
import { NewObjectiveModal } from './components/modals/NewObjectiveModal';
import { ExportDataModal } from './components/modals/ExportDataModal';
import { ApiKeyModal } from './components/modals/ApiKeyModal';

import { BookOpen, Plus, FileDown, Settings } from 'lucide-react';

export default function App() {
  const { t, i18n } = useTranslation();
  const [timer, setTimer] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerType, setTimerType] = useState<'trabalho' | 'pausa'>('trabalho');
  const [currentTarefa, setCurrentTarefa] = useState<ICurrentTarefa | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showObjetivoModal, setShowObjetivoModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  
  const apiKey = useApiKeyStore((state) => state.apiKey);

  useEffect(() => {
    // On initial load, check if API key is set.
    if (!apiKey) {
      setShowApiKeyModal(true);
    }
  }, [apiKey]);


  useEffect(() => {
    let interval: number;
    if (isRunning && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (isRunning && timer === 0) {
      window.clearInterval(interval);
      setIsRunning(false);

      if (Notification.permission === 'granted') {
        const title = timerType === 'trabalho' ? t('notifications.pomodoroCompleteTitle') : t('notifications.breakCompleteTitle');
        const body = timerType === 'trabalho' ? t('notifications.pomodoroCompleteBody') : t('notifications.breakCompleteBody');
        new Notification(title, {
          body: body,
          icon: 'https://placehold.co/64x64/7c3aed/white?text=P'
        });
      }

      if (timerType === 'trabalho') {
        setShowReviewModal(true);
      } else {
        setTimerType('trabalho');
        setTimer(25 * 60);
        setCurrentTarefa(null);
      }
    }
    return () => window.clearInterval(interval);
  }, [isRunning, timer, timerType, t]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleStartPomodoro = (tarefa: ITarefa) => {
    if (isRunning || !tarefa.id || !tarefa.objetivoId) return;
    setCurrentTarefa({
        id: tarefa.id,
        objetivoId: tarefa.objetivoId,
        nome: tarefa.nome
    });
    setTimerType('trabalho');
    setTimer(25 * 60);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimer(timerType === 'trabalho' ? 25 * 60 : 5 * 60);
  };

  const handleSaveReview = async (reviewData: {
    qualidade: number;
    distratores: string;
    notas: string;
    codigoPessoal: string;
  }) => {
    if (!currentTarefa) return;

    await db.pomodoros.add({
      ...reviewData,
      objetivoId: currentTarefa.objetivoId,
      tarefaId: currentTarefa.id,
      data: new Date().toISOString(),
      tipo: 'trabalho',
    });

    setShowReviewModal(false);

    setTimerType('pausa');
    setTimer(5 * 60);
    setIsRunning(true);
  };

  const handleToggleTarefa = async (tarefa: ITarefa) => {
    if (!tarefa.id) return;
    const newStatus = tarefa.status === 'done' ? 'todo' : 'done';
    await db.tarefas.update(tarefa.id, { status: newStatus });
  };
  
  const objetivoAtual = useLiveQuery(
    () => currentTarefa ? db.objetivos.get(currentTarefa.objetivoId) : Promise.resolve(null),
    [currentTarefa]
  );

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200 font-inter antialiased">
      <Header
        timer={timer}
        isRunning={isRunning}
        timerType={timerType}
        currentTarefa={currentTarefa}
        objetivoAtual={objetivoAtual}
        onPause={handlePause}
        onReset={handleReset}
        onSettingsClick={() => setShowApiKeyModal(true)}
      />

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <BookOpen size={24} /> {t('main.title')}
            </h2>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm">
                  <button 
                      onClick={() => i18n.changeLanguage('pt-BR')} 
                      className={`px-2 py-1 rounded transition-colors ${i18n.language.startsWith('pt') ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700'}`}
                  >
                      PT
                  </button>
                  <button 
                      onClick={() => i18n.changeLanguage('en')} 
                      className={`px-2 py-1 rounded transition-colors ${i18n.language === 'en' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700'}`}
                  >
                      EN
                  </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-sm rounded-lg hover:bg-slate-600 transition-all"
                >
                  <FileDown size={16} /> {t('main.export')}
                </button>
                <button
                  onClick={() => setShowObjetivoModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-sm font-medium text-white rounded-lg hover:bg-emerald-500 transition-all"
                >
                  <Plus size={16} /> {t('main.newObjective')}
                </button>
              </div>
            </div>
          </div>
          
          <ObjectiveList 
            onStartTarefa={handleStartPomodoro}
            onToggleTarefa={handleToggleTarefa}
            isTimerRunning={isRunning}
          />
        </div>
      </main>

      {showReviewModal && (
        <PomodoroReviewModal 
          onSave={handleSaveReview} 
          onClose={() => setShowReviewModal(false)}
        />
      )}
      {showObjetivoModal && (
        <NewObjectiveModal 
          onClose={() => setShowObjetivoModal(false)} 
        />
      )}
      {showExportModal && (
        <ExportDataModal
          onClose={() => setShowExportModal(false)}
        />
      )}
      {showApiKeyModal && (
        <ApiKeyModal
          onClose={() => setShowApiKeyModal(false)}
        />
      )}
    </div>
  );
}