/*
  Apps Script completo - Avaliação Qualitativa

  Abas necessárias:

  1) alunos
  Cabeçalho:
  id_aluno | nome | turma

  2) avaliacoes_qualitativas
  Cabeçalho:
  id_aluno | nome | turma | ano | trimestre | dados_json | nota_final | data_atualizacao

  Regra anti-duplicação:
  id_aluno + ano + trimestre
*/

const ABA_ALUNOS = "alunos";
const ABA_AVALIACOES = "avaliacoes_qualitativas";

function doGet(e) {
  try {
    const acao = e.parameter.acao;

    if (acao === "listarAlunos") {
      return listarAlunos();
    }

    return respostaJson({
      status: "erro",
      mensagem: "Ação inválida no GET."
    });

  } catch (erro) {
    return respostaJson({
      status: "erro",
      mensagem: erro.message
    });
  }
}

function doPost(e) {
  try {
    const dados = JSON.parse(e.postData.contents);

    if (dados.acao === "salvarAvaliacaoQualitativa") {
      return salvarAvaliacaoQualitativa(dados);
    }

    return respostaJson({
      status: "erro",
      mensagem: "Ação inválida no POST."
    });

  } catch (erro) {
    return respostaJson({
      status: "erro",
      mensagem: erro.message
    });
  }
}

function listarAlunos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = obterOuCriarAbaAlunos(ss);

  const ultimaLinha = sheet.getLastRow();

  if (ultimaLinha <= 1) {
    return respostaJson({
      status: "ok",
      alunos: []
    });
  }

  const valores = sheet.getRange(2, 1, ultimaLinha - 1, 3).getValues();

  const alunos = valores
    .filter(linha => linha[0] && linha[1] && linha[2])
    .map(linha => ({
      id_aluno: String(linha[0]),
      nome: String(linha[1]),
      turma: String(linha[2])
    }));

  return respostaJson({
    status: "ok",
    alunos
  });
}

function salvarAvaliacaoQualitativa(dados) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = obterOuCriarAbaAvaliacoes(ss);

  const idAluno = String(dados.aluno.id);
  const ano = String(dados.ano);
  const trimestre = String(dados.trimestre);

  const ultimaLinha = sheet.getLastRow();
  let valores = [];

  if (ultimaLinha > 1) {
    valores = sheet.getRange(2, 1, ultimaLinha - 1, 8).getValues();
  }

  const novaLinha = [
    idAluno,
    dados.aluno.nome,
    dados.aluno.turma,
    ano,
    trimestre,
    JSON.stringify(dados.avaliacao_qualitativa),
    dados.nota_final,
    new Date()
  ];

  const indiceExistente = valores.findIndex(linha => {
    return String(linha[0]) === idAluno &&
           String(linha[3]) === ano &&
           String(linha[4]) === trimestre;
  });

  if (indiceExistente >= 0) {
    const linhaPlanilha = indiceExistente + 2;
    sheet.getRange(linhaPlanilha, 1, 1, 8).setValues([novaLinha]);

    return respostaJson({
      status: "atualizado",
      mensagem: "Avaliação atualizada."
    });
  }

  sheet.appendRow(novaLinha);

  return respostaJson({
    status: "criado",
    mensagem: "Avaliação criada."
  });
}

function obterOuCriarAbaAlunos(ss) {
  let sheet = ss.getSheetByName(ABA_ALUNOS);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_ALUNOS);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "id_aluno",
      "nome",
      "turma"
    ]);
  }

  return sheet;
}

function obterOuCriarAbaAvaliacoes(ss) {
  let sheet = ss.getSheetByName(ABA_AVALIACOES);

  if (!sheet) {
    sheet = ss.insertSheet(ABA_AVALIACOES);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "id_aluno",
      "nome",
      "turma",
      "ano",
      "trimestre",
      "dados_json",
      "nota_final",
      "data_atualizacao"
    ]);
  }

  return sheet;
}

function respostaJson(objeto) {
  return ContentService
    .createTextOutput(JSON.stringify(objeto))
    .setMimeType(ContentService.MimeType.JSON);
}

function autorizarPlanilha() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  obterOuCriarAbaAlunos(ss);
  obterOuCriarAbaAvaliacoes(ss);
}
