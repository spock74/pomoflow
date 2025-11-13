import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/database';
import { IObjetivo, ITarefa, IChatMessage } from '../types';
import { ChevronDown, ChevronRight, Brain, Zap, Play, Check, Bot, SendHorizonal, User } from 'lucide-react';
import { useApiKeyStore } from '../store/useApiKeyStore';
import { GoogleGenAI } from '@google/genai';


interface ObjectiveItemProps {
    objetivo: IObjetivo;
    onStartTarefa: (tarefa: ITarefa) => void;
    onToggleTarefa: (tarefa: ITarefa) => void;
    isTimerRunning: boolean;
}

export const ObjectiveItem: React.FC<ObjectiveItemProps> = ({ objetivo, onStartTarefa, onToggleTarefa, isTimerRunning }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const tarefas = useLiveQuery(() => 
        objetivo.id ? db.tarefas.where({ objetivoId: objetivo.id }).toArray() : Promise.resolve([]),
        [objetivo.id]
    );

    const [chatInput, setChatInput] = useState('');
    const [isAssistantLoading, setIsAssistantLoading] = useState(false);
    const apiKey = useApiKeyStore((state) => state.apiKey);
    const chatContainerRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [objetivo.chatHistory]);


    const handlePromptChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!objetivo.id) return;
        await db.objetivos.update(objetivo.id, { promptsExecucao: e.target.value });
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim() || !objetivo.id || isAssistantLoading) return;
        if (!apiKey) {
            alert(t('objectiveItem.apiKeyMissing'));
            return;
        }

        const userMessage: IChatMessage = {
            role: 'user',
            parts: [{ text: chatInput }],
        };

        const newHistory = [...(objetivo.chatHistory || []), userMessage];
        
        await db.objetivos.update(objetivo.id, { chatHistory: newHistory });
        setChatInput('');
        setIsAssistantLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const chat = ai.chats.create({
                model: 'gemini-2.5-flash',
                history: objetivo.chatHistory || [],
            });

            const result = await chat.sendMessage({ message: chatInput });
            
            const modelMessage: IChatMessage = {
                role: 'model',
                parts: [{ text: result.text }],
            };

            const finalHistory = [...newHistory, modelMessage];
            await db.objetivos.update(objetivo.id, { chatHistory: finalHistory });

        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage: IChatMessage = {
                role: 'model',
                parts: [{ text: t('objectiveItem.aiError') }],
            };
            const finalHistory = [...newHistory, errorMessage];
            await db.objetivos.update(objetivo.id, { chatHistory: finalHistory });
        } finally {
            setIsAssistantLoading(false);
        }
    };
    
    const tarefasConcluidas = useMemo(() => 
        tarefas ? tarefas.filter(t => t.status === 'done').length : 0,
        [tarefas]
    );
    const totalTarefas = tarefas ? tarefas.length : 0;
    
    return (
        <div className="bg-slate-800 rounded-lg shadow-md transition-all">
            <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-700/50"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    <span className="font-semibold text-lg text-white">{objetivo.nome}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                   <span>{new Date(objetivo.data).toLocaleDateString()}</span>
                   <span className="px-2 py-0.5 bg-slate-700 rounded-full">
                     {t('objectiveItem.progress', { completed: tarefasConcluidas, total: totalTarefas })}
                   </span>
                </div>
            </div>
      
            {isExpanded && (
                <div className="p-4 border-t border-slate-700">
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-900 p-4 rounded-lg">
                            <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Brain size={16} /> {t('objectiveItem.level1Title')}</h4>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{objetivo.n1_definicao || t('objectiveItem.level1Placeholder')}</p>
                        </div>
                         <div className="bg-slate-900 p-4 rounded-lg">
                            <h4 className="font-semibold text-emerald-300 mb-2 flex items-center gap-2"><Zap size={16} /> {t('objectiveItem.level2Title')}</h4>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{objetivo.n2_passos || t('objectiveItem.level2Placeholder')}</p>
                        </div>
                    </div>
          
                    <h4 className="font-semibold text-emerald-300 mb-3">{t('objectiveItem.level3Title')}</h4>
                    <div className="space-y-2 mb-6">
                        {tarefas?.map((tarefa) => (
                            <div key={tarefa.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => onToggleTarefa(tarefa)}>
                                        {tarefa.status === 'done' ? (
                                            <Check size={18} className="text-green-400" />
                                        ) : (
                                            <div className="w-4 h-4 border-2 border-slate-400 rounded-sm"></div>
                                        )}
                                    </button>
                                    <span className={`text-sm ${tarefa.status === 'done' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                        {tarefa.nome}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs px-2 py-0.5 bg-slate-600 rounded-full">
                                        {t('objectiveItem.taskEstimate', { count: tarefa.estPomodoros })}
                                    </span>
                                    <button 
                                        onClick={() => onStartTarefa(tarefa)}
                                        disabled={isTimerRunning || tarefa.status === 'done'}
                                        className="p-2 bg-emerald-600 rounded-full text-white disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all"
                                    >
                                        <Play size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* AI Assistant */}
                    <div className="mt-6">
                        <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                            <Bot size={16} /> {t('objectiveItem.aiAssistantTitle')}
                        </h4>
                        <div className="bg-slate-900 rounded-lg p-4">
                            <div ref={chatContainerRef} className="h-48 overflow-y-auto mb-3 pr-2 space-y-4 text-sm">
                                {objetivo.chatHistory?.map((msg, index) => (
                                    <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.role === 'model' && <div className="flex-shrink-0 w-6 h-6 bg-emerald-800 rounded-full flex items-center justify-center"><Bot size={14} className="text-emerald-300" /></div>}
                                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-slate-700' : 'bg-slate-800'}`}>
                                            <p className="text-slate-200 whitespace-pre-wrap">{msg.parts[0].text}</p>
                                        </div>
                                         {msg.role === 'user' && <div className="flex-shrink-0 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center"><User size={14} className="text-slate-300" /></div>}
                                    </div>
                                ))}
                                {isAssistantLoading && (
                                     <div className="flex gap-3 justify-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-emerald-800 rounded-full flex items-center justify-center"><Bot size={14} className="text-emerald-300" /></div>
                                        <div className="max-w-md p-3 rounded-lg bg-slate-800">
                                            <p className="text-slate-400 animate-pulse">{t('objectiveItem.aiTyping')}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder={t('objectiveItem.aiPlaceholder')}
                                    className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    disabled={isAssistantLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isAssistantLoading || !chatInput.trim()}
                                    className="p-2 bg-emerald-600 rounded-md text-white disabled:bg-slate-500 disabled:cursor-not-allowed hover:bg-emerald-500 transition-all"
                                >
                                    <SendHorizonal size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
          
                    <h4 className="font-semibold text-emerald-300 mb-3 mt-6">{t('objectiveItem.promptsTitle')}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-900 p-4 rounded-lg">
                            <h5 className="font-medium text-sm text-slate-400 mb-2">{t('objectiveItem.planningPromptsTitle')}</h5>
                            <p className="text-sm text-slate-300 whitespace-pre-wrap">{objetivo.promptsPlanejamento || t('objectiveItem.planningPromptsPlaceholder')}</p>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-lg">
                            <h5 className="font-medium text-sm text-slate-400 mb-2">{t('objectiveItem.executionPromptsTitle')}</h5>
                            <textarea
                                className="w-full h-32 p-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder={t('objectiveItem.executionPromptsPlaceholder')}
                                value={objetivo.promptsExecucao || ''}
                                onChange={handlePromptChange}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};