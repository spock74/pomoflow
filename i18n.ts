import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      header: {
        focus: "Focus: {{objectiveName}} / {{taskName}}",
        break: "Break time... Breathe."
      },
      main: {
        title: "Battle Plans",
        export: "Export",
        newObjective: "New Objective"
      },
      objectiveList: {
        loading: "Loading objectives...",
        empty: "Click \"New Objective\" to create your first Battle Plan."
      },
      objectiveItem: {
        progress: "{{completed}} / {{total}}",
        level1Title: "Level 1: Definition/Scope",
        level1Placeholder: "N/A",
        level2Title: "Level 2: Conceptual Steps",
        level2Placeholder: "N/A",
        level3Title: "Level 3: Atomic Tasks",
        taskEstimate: "Est: {{count}} P",
        promptsTitle: "Prompts History (Gemini)",
        planningPromptsTitle: "Planning",
        planningPromptsPlaceholder: "No planning prompts saved.",
        executionPromptsTitle: "Execution (Take notes here)",
        executionPromptsPlaceholder: "Paste the execution prompts used here...",
        aiAssistantTitle: "AI Assistant",
        aiPlaceholder: "Ask something about this objective...",
        aiTyping: "Assistant is typing...",
        aiError: "Sorry, I encountered an error. Please try again.",
        apiKeyMissing: "Please set your Gemini API key in the settings first."
      },
      modals: {
        pomodoroReview: {
          title: "Pomodoro Finished!",
          description: "Good job! Rate your focus to refine your metrics.",
          qualityLabel: "Focus Quality (1-5)",
          distractorsLabel: "Main Distractors",
          distractorsPlaceholder: "Ex: E-mail, phone, noise...",
          notesLabel: "Notes / Mood",
          notesPlaceholder: "Ex: Felt focused, tired, good flow...",
          codeLabel: "Personal Code",
          codePlaceholder: "Your 3-letter code...",
          saveButton: "Save and Start Break (5 min)"
        },
        newObjective: {
          title: "Create New Battle Plan",
          objectiveNameLabel: "Objective Name",
          objectiveNamePlaceholder: "Ex: Refactor Authentication Module",
          generateButton: "Generate Plan with AI",
          generatingButton: "Generating...",
          generationPrompt: `Generate a plan for the following objective: "{{objectiveName}}".

The plan must contain:
1.  **n1_definicao**: A clear definition and scope of the objective. What is it and why is it important? What are the success criteria?
2.  **n2_passos**: The macro conceptual steps to achieve the objective. List 3 to 5 main steps.

Return the response strictly as a JSON object.`,
          errorPrefix: "Failed to generate plan.",
          errorApiKey: "The API key is not valid. Check your credentials.",
          errorApiKeyMissing: "Please set your Gemini API key in the settings first.",
          errorTimeout: "The request took too long. Please try again.",
          errorCheckConsole: "Check the console for more details.",
          errorUnknown: "An unknown error occurred.",
          errorMissingName: "Please enter an objective name first.",
          level1Label: "Level 1: Definition and Scope",
          level1Placeholder: "Describe the what and why, or let the AI generate it for you.",
          level2Label: "Level 2: Conceptual Steps",
          level2Placeholder: "List the macro steps, or let the AI generate it for you.",
          planningPromptLabel: "Planning Prompt (Optional)",
          planningPromptPlaceholder: "The prompt used to generate the plan will be saved here.",
          generatingPlaceholder: "Generating plan...",
          level3Title: "Level 3: Atomic Tasks",
          taskNamePlaceholder: "Task name",
          addTaskButton: "Add Task",
          saveButton: "Save Battle Plan"
        },
        export: {
          title: "Export Data",
          description: "Your data (Objectives, Tasks, and Pomodoro Metrics) is ready. Save this JSON file for backup or external analysis.",
          downloadButton: "Download JSON File",
          generating: "Generating data..."
        },
        apiKey: {
            title: "Gemini API Key",
            description: "To use AI features, please provide your Google Gemini API key. Your key is stored securely in memory for the current session only. It will be cleared when you close or reload this page.",
            getYourKey: "Get your key from Google AI Studio",
            inputLabel: "Your Gemini API Key",
            inputPlaceholder: "Paste your API key here",
            saveButton: "Save Key",
            removeButton: "Remove Key"
        }
      },
      notifications: {
        pomodoroCompleteTitle: "Pomodoro Complete!",
        pomodoroCompleteBody: "Time to rate your focus and take a break.",
        breakCompleteTitle: "Break's Over!",
        breakCompleteBody: "Time to get back to work!"
      }
    }
  },
  'pt-BR': {
    translation: {
      header: {
        focus: "Foco: {{objectiveName}} / {{taskName}}",
        break: "Pausa... Respire."
      },
      main: {
        title: "Planos de Batalha",
        export: "Exportar",
        newObjective: "Novo Objetivo"
      },
      objectiveList: {
        loading: "Carregando objetivos...",
        empty: "Clique em \"Novo Objetivo\" para criar seu primeiro Plano de Batalha."
      },
      objectiveItem: {
        progress: "{{completed}} / {{total}}",
        level1Title: "Nível 1: Definição/Escopo",
        level1Placeholder: "N/A",
        level2Title: "Nível 2: Passos Conceituais",
        level2Placeholder: "N/A",
        level3Title: "Nível 3: Tarefas Atômicas",
        taskEstimate: "Est: {{count}} P",
        promptsTitle: "Histórico de Prompts (Gemini)",
        planningPromptsTitle: "Planejamento",
        planningPromptsPlaceholder: "Nenhum prompt de planejamento salvo.",
        executionPromptsTitle: "Execução (Anote aqui)",
        executionPromptsPlaceholder: "Cole aqui os prompts de execução usados...",
        aiAssistantTitle: "Assistente de IA",
        aiPlaceholder: "Pergunte algo sobre este objetivo...",
        aiTyping: "Assistente está digitando...",
        aiError: "Desculpe, encontrei um erro. Por favor, tente novamente.",
        apiKeyMissing: "Por favor, configure sua chave de API do Gemini nas configurações primeiro."
      },
      modals: {
        pomodoroReview: {
          title: "Pomodoro Concluído!",
          description: "Bom trabalho! Avalie seu foco para refinar as métricas.",
          qualityLabel: "Qualidade do Foco (1-5)",
          distractorsLabel: "Principais Distratores",
          distractorsPlaceholder: "Ex: E-mail, celular, barulho...",
          notesLabel: "Notas / Humor",
          notesPlaceholder: "Ex: Me senti focado, cansado, fluxo bom...",
          codeLabel: "Código Pessoal",
          codePlaceholder: "Seu código de 3 letras...",
          saveButton: "Salvar e Iniciar Pausa (5 min)"
        },
        newObjective: {
          title: "Criar Novo Plano de Batalha",
          objectiveNameLabel: "Nome do Objetivo",
          objectiveNamePlaceholder: "Ex: Refatorar Módulo de Autenticação",
          generateButton: "Gerar Plano com IA",
          generatingButton: "Gerando...",
          generationPrompt: `Gere um plano para o seguinte objetivo: "{{objectiveName}}".
    
O plano deve conter:
1.  **n1_definicao**: Uma definição clara e o escopo do objetivo. O que é e por que é importante? Quais são os critérios de sucesso?
2.  **n2_passos**: Os passos conceituais macro para alcançar o objetivo. Liste de 3 a 5 passos principais.

Retorne a resposta estritamente como um objeto JSON.`,
          errorPrefix: "Falha ao gerar o plano.",
          errorApiKey: "A chave da API não é válida. Verifique suas credenciais.",
          errorApiKeyMissing: "Por favor, configure sua chave de API do Gemini nas configurações primeiro.",
          errorTimeout: "A requisição demorou muito. Tente novamente.",
          errorCheckConsole: "Verifique o console para mais detalhes.",
          errorUnknown: "Ocorreu um erro desconhecido.",
          errorMissingName: "Por favor, insira um nome para o objetivo primeiro.",
          level1Label: "Nível 1: Definição e Escopo",
          level1Placeholder: "Descreva o quê e por quê, ou deixe a IA gerar para você.",
          level2Label: "Nível 2: Passos Conceituais",
          level2Placeholder: "Liste os passos macro, ou deixe a IA gerar para você.",
          planningPromptLabel: "Prompt de Planejamento (Opcional)",
          planningPromptPlaceholder: "O prompt usado para gerar o plano será salvo aqui.",
          generatingPlaceholder: "Gerando plano...",
          level3Title: "Nível 3: Tarefas Atômicas",
          taskNamePlaceholder: "Nome da tarefa",
          addTaskButton: "Adicionar Tarefa",
          saveButton: "Salvar Plano de Batalha"
        },
        export: {
          title: "Exportar Dados",
          description: "Seus dados (Objetivos, Tarefas e Métricas de Pomodoro) estão prontos. Salve este arquivo JSON para backup ou análise externa.",
          downloadButton: "Baixar Arquivo JSON",
          generating: "Gerando dados..."
        },
        apiKey: {
            title: "Chave de API do Gemini",
            description: "Para usar os recursos de IA, por favor, forneça sua chave de API do Google Gemini. Sua chave é armazenada de forma segura apenas na memória para a sessão atual. Ela será apagada quando você fechar ou recarregar esta página.",
            getYourKey: "Obtenha sua chave no Google AI Studio",
            inputLabel: "Sua Chave de API do Gemini",
            inputPlaceholder: "Cole sua chave de API aqui",
            saveButton: "Salvar Chave",
            removeButton: "Remover Chave"
        }
      },
      notifications: {
        pomodoroCompleteTitle: "Pomodoro Concluído!",
        pomodoroCompleteBody: "Hora de avaliar seu foco e descansar.",
        breakCompleteTitle: "Pausa Concluída!",
        breakCompleteBody: "Hora de voltar ao trabalho!"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['pt-BR', 'en'],
    fallbackLng: 'pt-BR',
    debug: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;