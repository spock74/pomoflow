import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../../services/database';
import { Modal } from '../ui/Modal';
import { InputText } from '../ui/InputText';
import { InputTextArea } from '../ui/InputTextArea';
import { X, Plus, Sparkles } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { useApiKeyStore } from '../../store/useApiKeyStore';

interface NewObjectiveModalProps {
    onClose: () => void;
}

export const NewObjectiveModal: React.FC<NewObjectiveModalProps> = ({ onClose }) => {
    const { t } = useTranslation();
    const [nome, setNome] = useState('');
    const [n1, setN1] = useState('');
    const [n2, setN2] = useState('');
    const [promptsP, setPromptsP] = useState('');
    const [tarefas, setTarefas] = useState([{ nome: '', estPomodoros: 1 }]);
    
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const apiKey = useApiKeyStore((state) => state.apiKey);

    const handleGeneratePlan = async () => {
        if (!apiKey) {
            setGenerationError(t('modals.newObjective.errorApiKeyMissing'));
            return;
        }
        if (!nome) {
            setGenerationError(t('modals.newObjective.errorMissingName'));
            return;
        }
        setIsGenerating(true);
        setGenerationError(null);
        setN1('');
        setN2('');

        try {
            const ai = new GoogleGenAI({ apiKey });
            const prompt = t('modals.newObjective.generationPrompt', { objectiveName: nome });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            n1_definicao: {
                                type: Type.STRING,
                                description: 'Definição clara e escopo do objetivo.'
                            },
                            n2_passos: {
                                type: Type.STRING,
                                description: 'Passos conceituais macro para alcançar o objetivo.'
                            }
                        },
                        required: ["n1_definicao", "n2_passos"],
                    },
                },
            });

            let jsonText = response.text.trim();
            if (jsonText.startsWith("```json")) {
                jsonText = jsonText.substring(7, jsonText.length - 3).trim();
            } else if (jsonText.startsWith("```")) {
                 jsonText = jsonText.substring(3, jsonText.length - 3).trim();
            }

            const plan = JSON.parse(jsonText);
            setN1(plan.n1_definicao);
            setN2(plan.n2_passos);
            setPromptsP(prompt);

        } catch (error) {
            console.error(t('modals.newObjective.errorPrefix'), error);
            let message = `${t('modals.newObjective.errorPrefix')} `;
            if (error instanceof Error) {
                if (error.message.includes('API key not valid')) {
                    message += t('modals.newObjective.errorApiKey');
                } else if (error.message.includes('timed out')) {
                    message += t('modals.newObjective.errorTimeout');
                } else {
                    message += t('modals.newObjective.errorCheckConsole');
                }
            } else {
                 message += t('modals.newObjective.errorUnknown');
            }
            setGenerationError(message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTarefaChange = (index: number, field: 'nome' | 'estPomodoros', value: string | number) => {
        const novasTarefas = [...tarefas];
        (novasTarefas[index] as any)[field] = value;
        setTarefas(novasTarefas);
    };

    const addTarefa = () => {
        setTarefas([...tarefas, { nome: '', estPomodoros: 1 }]);
    };

    const removeTarefa = (index: number) => {
        const novasTarefas = tarefas.filter((_, i) => i !== index);
        setTarefas(novasTarefas);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const objetivoId = await db.objetivos.add({
                nome,
                n1_definicao: n1,
                n2_passos: n2,
                promptsPlanejamento: promptsP,
                data: new Date().toISOString(),
                status: 'planning',
                promptsExecucao: '',
                chatHistory: []
            });

            const tarefasParaAdd = tarefas
                .filter(t => t.nome.trim() !== '')
                .map(t => ({
                    objetivoId: objetivoId as number,
                    nome: t.nome,
                    estPomodoros: parseInt(String(t.estPomodoros), 10) || 1,
                    status: 'todo' as const
                }));

            await db.tarefas.bulkAdd(tarefasParaAdd);
            onClose();
        } catch (error) {
            console.error("Erro ao salvar objetivo:", error);
        }
    };

    return (
        <Modal title={t('modals.newObjective.title')} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <InputText label={t('modals.newObjective.objectiveNameLabel')} value={nome} onChange={setNome} placeholder={t('modals.newObjective.objectiveNamePlaceholder')} required />
                
                <div className="relative">
                    <button 
                        type="button"
                        onClick={handleGeneratePlan}
                        disabled={isGenerating || !nome || !apiKey}
                        className="absolute top-0 right-0 mt-2 mr-2 flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-xs font-medium text-white rounded-md hover:bg-emerald-500 transition-all disabled:bg-slate-500 disabled:cursor-not-allowed"
                    >
                       {isGenerating ? t('modals.newObjective.generatingButton') : <> <Sparkles size={14} /> {t('modals.newObjective.generateButton')} </>}
                    </button>
                    {generationError && <p className="text-xs text-red-400 mt-1">{generationError}</p>}
                </div>
       
                <InputTextArea label={t('modals.newObjective.level1Label')} value={isGenerating ? t('modals.newObjective.generatingPlaceholder') : n1} onChange={setN1} rows={3} placeholder={t('modals.newObjective.level1Placeholder')} />
                <InputTextArea label={t('modals.newObjective.level2Label')} value={isGenerating ? t('modals.newObjective.generatingPlaceholder') : n2} onChange={setN2} rows={4} placeholder={t('modals.newObjective.level2Placeholder')} />
                <InputTextArea label={t('modals.newObjective.planningPromptLabel')} value={promptsP} onChange={setPromptsP} rows={3} placeholder={t('modals.newObjective.planningPromptPlaceholder')} />
                
                <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">{t('modals.newObjective.level3Title')}</h4>
                    <div className="space-y-2">
                        {tarefas.map((tarefa, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    placeholder={t('modals.newObjective.taskNamePlaceholder')}
                                    value={tarefa.nome}
                                    onChange={(e) => handleTarefaChange(index, 'nome', e.target.value)}
                                    className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    value={tarefa.estPomodoros}
                                    onChange={(e) => handleTarefaChange(index, 'estPomodoros', Number(e.target.value))}
                                    className="w-20 p-2 bg-slate-700 border border-slate-600 rounded-md text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                                <button type="button" onClick={() => removeTarefa(index)} className="p-2 text-red-400 hover:text-red-300">
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addTarefa} className="mt-2 text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                            <Plus size={16} /> {t('modals.newObjective.addTaskButton')}
                        </button>
                    </div>
                </div>

                 <button
                    type="submit"
                    className="w-full mt-6 py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-500 transition-all"
                  >
                    {t('modals.newObjective.saveButton')}
                </button>
            </form>                
      </Modal>
    );
};