/*
  DADOS FIXOS DO SISTEMA

  Aqui você configura:
  - URL do Apps Script
  - anos e trimestres
  - conceitos
  - avaliações fixas para todas as turmas
  - atividades variáveis por turma

  Os alunos NÃO ficam mais aqui.
  Eles serão carregados da aba "alunos" da planilha.
*/

const DADOS = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbw3bvjwOEazNAOC42TViM7uJrAscHmeV6FjbHYDJdBZ69nak-N9xFKXS5k-8qXidRKQ/exec",

  anos: ["2026"],

  trimestres: ["1º trimestre", "2º trimestre", "3º trimestre"],

  conceitos: {
    A: 10,
    B: 5,
    C: 0
  },

  avaliacoesFixas: [
    "Responsabilidade/Comprometimento",
    "Participação",
    "Pontualidade",
    "Assiduidade"
  ],

  /*
    Atividades variáveis por turma.
    A chave precisa ser igual ao valor da turma na aba alunos.

    Exemplo:
    Se na aba alunos a turma estiver como "31", use "31".
    Se estiver como "3º ano - Turma 31", use "3º ano - Turma 31".
  */
  atividadesPorTurma: {
    "31": [
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto",
      "Atividade 3 - Arquivos e pastas"
    ],

    "32": [
      "Atividade 1 - Armazenamento e memória",
      "Atividade 2 - Editor de texto"
    ],

    "41": [
      "Atividade 1 - Codificação binária",
      "Atividade 2 - Tabela ASCII",
      "Atividade 3 - Armazenamento de dados",
      "Atividade 4 - Revisão prática"
    ]
  }
};
