const turmaSelect = document.getElementById("turmaSelect");
const alunoSelect = document.getElementById("alunoSelect");
const filtroTurma = document.getElementById("filtroTurma");
const pesquisaAluno = document.getElementById("pesquisaAluno");
const anoSelect = document.getElementById("anoSelect");
const trimestreSelect = document.getElementById("trimestreSelect");
const itensContainer = document.getElementById("itensContainer");
const notaFinalEl = document.getElementById("notaFinal");
const mensagemEl = document.getElementById("mensagem");
const statusAlunoEl = document.getElementById("statusAluno");
const contadorRegistrosEl = document.getElementById("contadorRegistros");

let alunos = [];
let alunosFiltrados = [];
let indiceAtual = 0;
let avaliacao = {};

function iniciar() {
  carregarAnosETrimestres();
  configurarEventos();
  carregarAlunosDaPlanilha();
}

function configurarEventos() {
  filtroTurma.addEventListener("change", aplicarFiltros);
  pesquisaAluno.addEventListener("input", aplicarFiltros);

  turmaSelect.addEventListener("change", () => {
    filtroTurma.value = turmaSelect.value;
    aplicarFiltros();
  });

  alunoSelect.addEventListener("change", () => {
    const idSelecionado = alunoSelect.value;
    const novoIndice = alunosFiltrados.findIndex(aluno => aluno.id === idSelecionado);
    if (novoIndice >= 0) indiceAtual = novoIndice;
    selecionarAlunoAtual();
  });

  anoSelect.addEventListener("change", atualizarStatusAluno);
  trimestreSelect.addEventListener("change", atualizarStatusAluno);

  document.getElementById("btnSalvar").addEventListener("click", salvarAvaliacao);
  document.getElementById("btnLimpar").addEventListener("click", limparConceitos);
  document.getElementById("btnAnterior").addEventListener("click", alunoAnterior);
  document.getElementById("btnProximo").addEventListener("click", proximoAluno);
  document.getElementById("btnLimparPesquisa").addEventListener("click", limparPesquisa);
  document.getElementById("btnRecarregarAlunos").addEventListener("click", carregarAlunosDaPlanilha);
}

function carregarAnosETrimestres() {
  DADOS.anos.forEach(ano => {
    const option = document.createElement("option");
    option.value = ano;
    option.textContent = ano;
    anoSelect.appendChild(option);
  });

  DADOS.trimestres.forEach(trimestre => {
    const option = document.createElement("option");
    option.value = trimestre;
    option.textContent = trimestre;
    trimestreSelect.appendChild(option);
  });
}

async function carregarAlunosDaPlanilha() {
  try {
    mensagemEl.textContent = "Carregando alunos da planilha...";

    const url = `${DADOS.appsScriptUrl}?acao=listarAlunos`;
    const resposta = await fetch(url);
    const retorno = await resposta.json();

    if (retorno.status !== "ok") {
      throw new Error(retorno.mensagem || "Erro ao carregar alunos.");
    }

    alunos = retorno.alunos.map(aluno => ({
      id: String(aluno.id_aluno),
      nome: String(aluno.nome),
      turma: String(aluno.turma)
    }));

    alunos.sort((a, b) => {
      if (a.turma !== b.turma) return a.turma.localeCompare(b.turma);
      return a.nome.localeCompare(b.nome);
    });

    carregarTurmasNosSelects();
    aplicarFiltros();

    mensagemEl.textContent = "Alunos carregados com sucesso.";
  } catch (erro) {
    console.error(erro);
    mensagemEl.textContent = "Erro ao carregar alunos. Confira a URL do Apps Script e a aba alunos.";
    statusAlunoEl.textContent = "Erro ao carregar alunos";
  }
}

function carregarTurmasNosSelects() {
  const turmas = [...new Set(alunos.map(aluno => aluno.turma))].sort();

  turmaSelect.innerHTML = "";
  filtroTurma.innerHTML = '<option value="">Todas as turmas</option>';

  turmas.forEach(turma => {
    const option1 = document.createElement("option");
    option1.value = turma;
    option1.textContent = turma;
    turmaSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = turma;
    option2.textContent = turma;
    filtroTurma.appendChild(option2);
  });

  if (turmas.length > 0) {
    turmaSelect.value = turmas[0];
    filtroTurma.value = turmas[0];
  }
}

function aplicarFiltros() {
  const termo = removerAcentos(pesquisaAluno.value.trim().toLowerCase());
  const turma = filtroTurma.value;

  alunosFiltrados = alunos.filter(aluno => {
    const nomeNormalizado = removerAcentos(aluno.nome.toLowerCase());

    const passaNome = !termo || nomeNormalizado.includes(termo);
    const passaTurma = !turma || aluno.turma === turma;

    return passaNome && passaTurma;
  });

  indiceAtual = 0;
  preencherSelectAlunos();
  selecionarAlunoAtual();
}

function preencherSelectAlunos() {
  alunoSelect.innerHTML = "";

  alunosFiltrados.forEach(aluno => {
    const option = document.createElement("option");
    option.value = aluno.id;
    option.textContent = aluno.nome;
    alunoSelect.appendChild(option);
  });

  contadorRegistrosEl.textContent = `${alunosFiltrados.length} aluno(s)`;
}

function selecionarAlunoAtual() {
  if (alunosFiltrados.length === 0) {
    alunoSelect.innerHTML = "";
    statusAlunoEl.textContent = "Nenhum aluno encontrado";
    itensContainer.innerHTML = "";
    notaFinalEl.textContent = "-";
    atualizarBotoesNavegacao();
    return;
  }

  const aluno = alunosFiltrados[indiceAtual];
  alunoSelect.value = aluno.id;
  turmaSelect.value = aluno.turma;

  avaliacao = {};
  montarItens();
  atualizarStatusAluno();
  atualizarBotoesNavegacao();
}

function getAlunoAtual() {
  return alunosFiltrados[indiceAtual] || null;
}

function getItensAvaliativos() {
  const aluno = getAlunoAtual();
  const turma = aluno ? aluno.turma : "";
  const atividades = DADOS.atividadesPorTurma[turma] || [];

  return [
    ...DADOS.avaliacoesFixas.map(nome => ({ nome, tipo: "Avaliação fixa" })),
    ...atividades.map(nome => ({ nome, tipo: "Atividade da turma" }))
  ];
}

function montarItens() {
  itensContainer.innerHTML = "";

  getItensAvaliativos().forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "item";

    const nome = document.createElement("div");
    nome.className = "item-nome";
    nome.innerHTML = `${item.nome}<br><span class="item-tipo">${item.tipo}</span>`;

    const botoes = document.createElement("div");
    botoes.className = "conceitos";

    Object.keys(DADOS.conceitos).forEach(conceito => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "conceito-btn";
      btn.textContent = conceito;
      btn.dataset.item = item.nome;
      btn.dataset.conceito = conceito;

      btn.addEventListener("click", () => selecionarConceito(item.nome, conceito, itemDiv));

      botoes.appendChild(btn);
    });

    itemDiv.appendChild(nome);
    itemDiv.appendChild(botoes);
    itensContainer.appendChild(itemDiv);
  });

  calcularNota();
}

function selecionarConceito(item, conceito, itemDiv) {
  avaliacao[item] = conceito;

  itemDiv.querySelectorAll(".conceito-btn").forEach(btn => {
    btn.classList.toggle("ativo", btn.dataset.conceito === conceito);
  });

  calcularNota();
}

function calcularNota() {
  const conceitosMarcados = Object.values(avaliacao);

  if (conceitosMarcados.length === 0) {
    notaFinalEl.textContent = "-";
    return null;
  }

  const soma = conceitosMarcados.reduce((total, conceito) => {
    return total + Number(DADOS.conceitos[conceito]);
  }, 0);

  const media = soma / conceitosMarcados.length;
  notaFinalEl.textContent = media.toFixed(2).replace(".", ",");

  return Number(media.toFixed(2));
}

function atualizarStatusAluno() {
  const aluno = getAlunoAtual();

  if (!aluno) {
    statusAlunoEl.textContent = "Selecione um aluno";
    return;
  }

  statusAlunoEl.textContent = `${indiceAtual + 1}/${alunosFiltrados.length} - ${aluno.nome} | Turma ${aluno.turma} | ${anoSelect.value} | ${trimestreSelect.value}`;
}

function atualizarBotoesNavegacao() {
  document.getElementById("btnAnterior").disabled = indiceAtual <= 0;
  document.getElementById("btnProximo").disabled = indiceAtual >= alunosFiltrados.length - 1 || alunosFiltrados.length === 0;
}

function alunoAnterior() {
  if (indiceAtual > 0) {
    indiceAtual--;
    selecionarAlunoAtual();
  }
}

function proximoAluno() {
  if (indiceAtual < alunosFiltrados.length - 1) {
    indiceAtual++;
    selecionarAlunoAtual();
  }
}

function limparPesquisa() {
  pesquisaAluno.value = "";
  filtroTurma.value = turmaSelect.value || "";
  aplicarFiltros();
}

function limparConceitos() {
  avaliacao = {};
  document.querySelectorAll(".conceito-btn").forEach(btn => btn.classList.remove("ativo"));
  calcularNota();
  mensagemEl.textContent = "Conceitos limpos na tela. Clique em salvar para atualizar a planilha.";
}

async function salvarAvaliacao() {
  const aluno = getAlunoAtual();
  const notaFinal = calcularNota();

  if (!aluno) {
    mensagemEl.textContent = "Selecione um aluno.";
    return;
  }

  if (Object.keys(avaliacao).length === 0) {
    mensagemEl.textContent = "Marque pelo menos um conceito.";
    return;
  }

  const payload = {
    acao: "salvarAvaliacaoQualitativa",
    aluno: {
      id: aluno.id,
      nome: aluno.nome,
      turma: aluno.turma
    },
    ano: anoSelect.value,
    trimestre: trimestreSelect.value,
    avaliacao_qualitativa: avaliacao,
    nota_final: notaFinal
  };

  try {
    mensagemEl.textContent = "Salvando...";

    const resposta = await fetch(DADOS.appsScriptUrl, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const retorno = await resposta.json();

    if (retorno.status === "atualizado") {
      mensagemEl.textContent = "Avaliação atualizada com sucesso.";
    } else if (retorno.status === "criado") {
      mensagemEl.textContent = "Nova avaliação criada com sucesso.";
    } else {
      mensagemEl.textContent = retorno.mensagem || "Resposta recebida, mas sem status esperado.";
    }
  } catch (erro) {
    console.error(erro);
    mensagemEl.textContent = "Erro ao salvar. Confira a URL do Apps Script e a implantação.";
  }
}

function removerAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

iniciar();
