const API_URL = CONFIG.API_URL;

let alunos = [];
    let avaliacoes = [];
    let indiceAtual = 0;

    const container = document.getElementById("avaliacaoContainer");

    function normalizarId(texto) {
      return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "_")
        .toLowerCase();
    }

    function renderizarItens() {
      container.innerHTML = "";
      document.getElementById("totalItens").textContent = itensAvaliativos.length;

      itensAvaliativos.forEach((item) => {
        const card = document.createElement("div");
        card.className = "category";

        const header = document.createElement("div");
        header.className = "category-title";
        header.innerHTML = `<h4>${item.icone} ${item.titulo}</h4><span class="count" data-count="${item.titulo}">0</span>`;
        card.appendChild(header);

        item.opcoes.forEach((opcao) => {
          const id = normalizarId(item.titulo + "_" + opcao);

          const label = document.createElement("label");
          label.className = "option";
          label.htmlFor = id;

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = id;
          checkbox.dataset.item = item.titulo;
          checkbox.dataset.opcao = opcao;
          checkbox.addEventListener("change", atualizarPreview);

          const span = document.createElement("span");
          span.textContent = opcao;

          label.appendChild(checkbox);
          label.appendChild(span);
          card.appendChild(label);
        });

        container.appendChild(card);
      });
    }

    function coletarDados() {
      const selecionados = {};

      document.querySelectorAll('input[type="checkbox"]:checked').forEach((check) => {
        const item = check.dataset.item;
        const opcao = check.dataset.opcao;

        if (!selecionados[item]) selecionados[item] = [];
        selecionados[item].push(opcao);
      });

      return {
        aluno: {
          id: document.getElementById("idAluno").value,
          nome: document.getElementById("nomeAluno").value,
          turma: document.getElementById("turmaAluno").value,
          trimestre: document.getElementById("trimestre").value
        },
        avaliacao: selecionados,
        observacoes: document.getElementById("observacoes").value,
        parecer: document.querySelector(".parecer").value || "",
        //instrucaoIA: "Gerar parecer descritivo em 3 a 4 parágrafos, linguagem formal, clara, pedagógica, sem inventar informações, usando apenas os dados fornecidos."
      };
    }

    function atualizarContadores() {
      const total = document.querySelectorAll('input[type="checkbox"]:checked').length;
      document.getElementById("totalSelecionados").textContent = total;
      document.getElementById("sideCount").textContent = `${total} marcadores`;
      document.getElementById("sideNome").textContent = document.getElementById("nomeAluno").value || "Aluno atual";
      
      document.getElementById("sideId").textContent = 
      `ID ${document.getElementById("idAluno").value || "--"}`;
      document.getElementById("sideTurma").textContent = 
      `Turma ${document.getElementById("turmaAluno").value || "--"}`;

      itensAvaliativos.forEach(item => {
        const count = document.querySelectorAll(`input[data-item="${item.titulo}"]:checked`).length;
        const el = document.querySelector(`[data-count="${item.titulo}"]`);
        if (el) el.textContent = count;
      });
    }

    function atualizarPreview() {
      atualizarContadores();
      const dados = coletarDados();
      document.getElementById("jsonPreview").textContent = JSON.stringify(dados, null, 2);
    }

    function limparChecks() {
      document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      atualizarPreview();
    }

    function limparBusca() {
      document.getElementById("buscaAluno").value = "";
      document.getElementById("turmaBusca").value = "";
    }

    function limparTelaAvaliacao() {
      document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
      document.getElementById("observacoes").value = "";
      document.querySelector(".parecer").value = "";
      atualizarPreview();
    }

    function novoRegistro() {
      document.getElementById("idAluno").value = "";
      document.getElementById("nomeAluno").value = "";
      document.getElementById("turmaAluno").value = document.getElementById("turmaBusca").value || "";
      limparTelaAvaliacao();
    }

    async function carregarAlunos() {
      const res = await fetch(`${API_URL}?acao=alunos&v=${Date.now()}`);
      alunos = await res.json();

      console.log("Resposta alunos:", alunos);

      if (!Array.isArray(alunos)) {
        throw new Error("A resposta de alunos não é uma lista. Retorno: " + JSON.stringify(alunos));
      }

      alunos = alunos.filter(a => a && a.id !== "" && a.nome);
    }

    async function carregarAvaliacoes() {
      const res = await fetch(`${API_URL}?acao=avaliacoes`);
      avaliacoes = await res.json();

      atualizarProgressoAvaliacoes();
    }

    async function iniciarSistema() {
        try {
        await carregarAlunos();
        await carregarAvaliacoes();
        atualizarProgressoAvaliacoes();

        console.log("Alunos carregados:", alunos);

        if (Array.isArray(alunos) && alunos.length > 0) {
          carregarAluno(0);
        } else {
          console.warn("Nenhum aluno carregado.");
          atualizarPreview();
        }
      } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar alunos/avaliações. Confira a URL do Apps Script e o deploy.");
      }
    }

    function carregarAluno(indice) {
      if (!Array.isArray(alunos) || alunos.length === 0) {
        console.warn("Lista de alunos vazia ou inválida:", alunos);
        return;
      }

      if (indice < 0 || indice >= alunos.length) {
        console.warn("Índice inválido:", indice);
        return;
      }

      const aluno = alunos[indice];

      if (!aluno) {
        console.warn("Aluno não encontrado no índice:", indice, alunos);
        return;
      }

      indiceAtual = indice;

      document.getElementById("idAluno").value = aluno.id || "";
      document.getElementById("nomeAluno").value = aluno.nome || "";
      document.getElementById("turmaAluno").value = aluno.turma || "";

      limparTelaAvaliacao();

      const avaliacaoSalva = avaliacoes
        .filter(a => String(a.id_aluno) === String(aluno.id))
        .pop();

      if (avaliacaoSalva) carregarAvaliacaoSalva(avaliacaoSalva);

      atualizarPreview();
    }

    function carregarAvaliacaoSalva(avaliacaoSalva) {
      try {
        const dados = JSON.parse(avaliacaoSalva.dados_json || "{}");

        Object.keys(dados).forEach(item => {
          dados[item].forEach(opcao => {
            const check = [...document.querySelectorAll('input[type="checkbox"]')].find(c =>
              c.dataset.item === item && c.dataset.opcao === opcao
            );
            if (check) check.checked = true;
          });
        });

        document.getElementById("observacoes").value = avaliacaoSalva.observacoes || "";
        document.querySelector(".parecer").value = avaliacaoSalva.parecer || "";
      } catch (erro) {
        console.error("Erro ao carregar avaliação salva:", erro);
      }
    }

    function proximoAluno() {
      if (indiceAtual < alunos.length - 1) carregarAluno(indiceAtual + 1);
    }

    function alunoAnterior() {
      if (indiceAtual > 0) carregarAluno(indiceAtual - 1);
    }

    function primeiroAluno() {
      carregarAluno(0);
    }

    function ultimoAluno() {
      carregarAluno(alunos.length - 1);
    }

    function pesquisarAluno() {
      const termo = document.getElementById("buscaAluno").value.trim().toLowerCase();
      const turma = document.getElementById("turmaBusca").value.trim();

      const indice = alunos.findIndex(aluno => {
        const nome = String(aluno.nome || "").toLowerCase();
        const id = String(aluno.id || "").toLowerCase();
        const nomeOuIdConfere = termo === "" || nome.includes(termo) || id === termo;
        const turmaConfere = turma === "" || String(aluno.turma) === turma;
        return nomeOuIdConfere && turmaConfere;
      });

      if (indice >= 0) carregarAluno(indice);
      else alert("Aluno não encontrado.");
    }

    function toggleSidebar() {
      const app = document.querySelector(".app");
      app.classList.toggle("collapsed");
    }

  function atualizarProgressoAvaliacoes() {
  if (!Array.isArray(alunos) || !Array.isArray(avaliacoes)) return;

  const trimestreAtual = document.getElementById("trimestre").value;
  const turmaAtual = document.getElementById("turmaBusca").value || document.getElementById("turmaAluno").value;

  const alunosTurma = alunos.filter(a => String(a.turma) === String(turmaAtual));

  const avaliados = alunosTurma.filter(aluno =>
    avaliacoes.some(av =>
      String(av.id_aluno) === String(aluno.id) &&
      String(av.trimestre) === String(trimestreAtual)
    )
  );

  const total = alunosTurma.length;
  const concluidas = avaliados.length;
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

  document.getElementById("percentualAvaliacoes").textContent = `${percentual}%`;
  document.getElementById("barraAvaliacoes").style.width = `${percentual}%`;
}

    async function salvarNoSheets(avancarDepois = false) {
  if (!API_URL || API_URL.includes("COLE_A_URL")) {
    alert("Configure a URL do Apps Script no config.js");
    return;
  }

  const dados = coletarDados();

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (resultado.status !== "ok") {
      alert("Erro ao salvar: " + (resultado.mensagem || "erro desconhecido"));
      return;
    }

    if (resultado.tipo === "novo") {
      alert("➕ Novo registro criado!");
    } else if (resultado.tipo === "atualizado") {
      alert("♻️ Registro atualizado!");
    } else {
      alert("✔️ Salvo com sucesso!");
    }

    await carregarAvaliacoes();

    if (avancarDepois) proximoAluno();

  } catch (err) {
    console.error("Erro ao enviar:", err);
    alert("Erro ao enviar.");
  }
}

    ["observacoes", "nomeAluno", "idAluno", "turmaAluno", "trimestre"].forEach(id => {
      document.getElementById(id).addEventListener("input", atualizarPreview);
      document.getElementById(id).addEventListener("change", atualizarPreview);
    });

    renderizarItens();
    atualizarPreview();
    iniciarSistema();

      async function gerarParecerIA() {
      const campoParecer = document.querySelector(".parecer");

      const dados = {
        aluno: {
          id: document.getElementById("idAluno").value,
          nome: document.getElementById("nomeAluno").value,
          turma: document.getElementById("turmaAluno").value,
          trimestre: document.getElementById("trimestre").value
        },
        avaliacao: coletarDados().avaliacao,
        observacoes: document.getElementById("observacoes").value,
        parecer: campoParecer.value || ""
      };

      campoParecer.value = "Gerando parecer, aguarde...";

      try {
        const resposta = await fetch(CONFIG.API_URL, {
          method: "POST",
          body: JSON.stringify({
            acao: "gerar_parecer",
            dados: dados
          })
        });

        const resultado = await resposta.json();

        if (resultado.status === "ok") {
          campoParecer.value = resultado.parecer;
          atualizarPreview();
        } else {
          campoParecer.value = "";
          alert("Erro: " + resultado.mensagem);
        }
      } catch (erro) {
        campoParecer.value = "";
        alert("Erro ao conectar com a IA.");
        console.error(erro);
      }
    }