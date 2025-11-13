import { Dexie, type Table } from 'dexie';
import { IObjetivo, ITarefa, IPomodoro } from '../types';

export class PomodoroWorkflowDB extends Dexie {
  objetivos!: Table<IObjetivo>;
  tarefas!: Table<ITarefa>;
  pomodoros!: Table<IPomodoro>;

  constructor() {
    super('PomodoroWorkflowDB');
    this.version(3).stores({
      objetivos: '++id, data, nome, status, n1_definicao, n2_passos, promptsPlanejamento, promptsExecucao, chatHistory',
      tarefas: '++id, objetivoId, nome, estPomodoros, status',
      pomodoros: '++id, objetivoId, tarefaId, data, tipo, qualidade, distratores, notas, codigoPessoal'
    });
  }
}

export const db = new PomodoroWorkflowDB();