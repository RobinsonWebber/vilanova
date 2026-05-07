AVALIAÇÃO QUALITATIVA V2 - BROW

NOVIDADES:
- Alunos carregados da planilha.
- Pesquisa por nome.
- Filtro por turma.
- Navegação anterior/próximo.
- Avaliações fixas para todas as turmas.
- Atividades variáveis por turma no dados.js.
- Anti-duplicação por id_aluno + ano + trimestre.

ABAS DA PLANILHA:

1) alunos
id_aluno | nome | turma

Exemplo:
301 | ALUNO EXEMPLO 1 | 31
302 | ALUNO EXEMPLO 2 | 31
401 | ALUNO EXEMPLO 3 | 41

2) avaliacoes_qualitativas
id_aluno | nome | turma | ano | trimestre | dados_json | nota_final | data_atualizacao

ARQUIVOS:
- index.html
- style.css
- dados.js
- app.js
- Codigo.gs

COMO CONFIGURAR:
1. Crie ou abra sua planilha.
2. Crie a aba alunos com id_aluno, nome e turma.
3. No Apps Script, cole o Código.gs.
4. Execute autorizarPlanilha.
5. Implante como App da Web.
6. Cole a URL no dados.js em appsScriptUrl.
7. Edite as atividades por turma em dados.js.

IMPORTANTE:
No dados.js, as chaves de atividadesPorTurma precisam ser iguais ao valor da turma na aba alunos.
Exemplo:
Se na aba alunos a turma é 31, use "31".
