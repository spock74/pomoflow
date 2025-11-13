
export interface IObjetivo {
  id?: number;
  data: string;
  nome: string;
  status: 'planning' | 'active' | 'done';
  n1_definicao: string;
  n2_passos: string;
  promptsPlanejamento: string;
  promptsExecucao: string;
}

export interface ITarefa {
  id?: number;
  objetivoId: number;
  nome: string;
  estPomodoros: number;
  status: 'todo' | 'done';
}

export interface IPomodoro {
  id?: number;
  objetivoId: number;
  tarefaId: number;
  data: string;
  tipo: 'trabalho' | 'pausa';
  qualidade: number;
  distratores: string;
  notas: string;
  codigoPessoal: string;
}

export interface ICurrentTarefa {
    id: number;
    objetivoId: number;
    nome: string;
}
