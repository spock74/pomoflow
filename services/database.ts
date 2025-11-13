// FIX: Changed default import of Dexie to a named import to align with modern versions of the library, resolving the type error on `this.version`.
import { Dexie, type Table } from 'dexie';
import { IObjetivo, ITarefa, IPomodoro } from '../types';

export class PomodoroWorkflowDB extends Dexie {
  objetivos!: Table<IObjetivo>;
  tarefas!: Table<ITarefa>;
  pomodoros!: Table<IPomodoro>;

  constructor() {
    super('PomodoroWorkflowDB');
    this.version(2).stores({
      objetivos: '++id, data, nome, status, n1_definicao, n2_passos, promptsPlanejamento, promptsExecucao',
      tarefas: '++id, objetivoId, nome, estPomodoros, status', // status: 'todo', 'done'
      pomodoros: '++id, objetivoId, tarefaId, data, tipo, qualidade, distratores, notas, codigoPessoal' // tipo: 'trabalho', 'pausa'
    });
  }
}

export const db = new PomodoroWorkflowDB();
