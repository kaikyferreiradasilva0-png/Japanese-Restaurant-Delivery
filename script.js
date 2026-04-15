const API_BASE = "http://localhost:8080";

const CONFIG = {
  clientes: {
    nomeExibicao: "Cliente",
    rota: "clientes",
    campos: [
      { id: "nome", label: "Nome", tipo: "text" },
      { id: "telefone", label: "Telefone", tipo: "text" },
      { id: "email", label: "Email", tipo: "email" },
      { id: "rua", label: "Rua", tipo: "text" },
      { id: "numero", label: "Número", tipo: "text" },
      { id: "bairro", label: "Bairro", tipo: "text" },
      { id: "cidade", label: "Cidade", tipo: "text" },
      { id: "complemento", label: "Complemento", tipo: "text" },
    ],
  },

  atendentes: {
    nomeExibicao: "Atendente",
    rota: "atendentes",
    campos: [
      { id: "nome", label: "Nome", tipo: "text" },
      { id: "telefone", label: "Telefone", tipo: "text" },
      { id: "turno", label: "Turno", tipo: "text" },
    ],
  },

  pedidos: {
    nomeExibicao: "Pedido",
    rota: "pedidos",
    campos: [
      { id: "dataPedido", label: "Data do Pedido", tipo: "date" },
      { id: "statusPedido", label: "Status", tipo: "text" },
      { id: "formaPagamento", label: "Forma de Pagamento", tipo: "text" },
      { id: "valorTotal", label: "Valor Total", tipo: "number", step: "0.01" },
      { id: "observacao", label: "Observação", tipo: "text" },
      { id: "idCliente", label: "ID Cliente", tipo: "number" },
      { id: "idAtendente", label: "ID Atendente", tipo: "number" },
    ],
  },
};

function getEntidadeSelecionada() {
  return document.getElementById("entidade").value;
}

function getConfigAtual() {
  return CONFIG[getEntidadeSelecionada()];
}

function mostrarMensagem(texto, tipo = "neutra") {
  const mensagem = document.getElementById("mensagem");
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
}

function mostrarResultado(dados) {
  document.getElementById("resultado").textContent = JSON.stringify(
    dados,
    null,
    2,
  );
}

function mostrarErro(texto) {
  mostrarMensagem(texto, "erro");
  document.getElementById("resultado").textContent = `Erro: ${texto}`;
}

function limparResultado() {
  document.getElementById("resultado").textContent = "Nenhum dado carregado.";
}

function limparTabela() {
  document.getElementById("tabelaWrapper").innerHTML =
    '<p class="sem-dados">Nenhum dado carregado.</p>';
}

function criarCampo(campo) {
  const wrapper = document.createElement("div");
  wrapper.className = "campo";

  const label = document.createElement("label");
  label.setAttribute("for", campo.id);
  label.textContent = campo.label;

  const input = document.createElement("input");
  input.type = campo.tipo;
  input.id = campo.id;
  input.name = campo.id;
  input.placeholder = `Digite ${campo.label.toLowerCase()}`;

  if (campo.step) {
    input.step = campo.step;
  }

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return wrapper;
}

function renderizarFormulario() {
  const formulario = document.getElementById("formularioDinamico");
  const config = getConfigAtual();

  formulario.innerHTML = "";

  config.campos.forEach((campo) => {
    formulario.appendChild(criarCampo(campo));
  });

  limparCamposFormulario();
  limparTabela();
  limparResultado();
  mostrarMensagem("Formulário carregado com sucesso.", "neutra");

  
  const campoBusca = document.getElementById("buscarNome");
  const labelBusca = document.querySelector("label[for='buscarNome']");
  const botaoBusca = document.getElementById("btnBuscarNome");
  const tituloBusca = document.getElementById("tituloBusca");

  if (getEntidadeSelecionada() === "pedidos") {
    if (campoBusca) campoBusca.placeholder = "Digite o status";
    if (labelBusca) labelBusca.textContent = "Status";
    if (botaoBusca) botaoBusca.textContent = "Buscar por Status";
    if (tituloBusca) tituloBusca.textContent = "Buscar por Status";
  } else {
    if (campoBusca) campoBusca.placeholder = "Digite o nome";
    if (labelBusca) labelBusca.textContent = "Nome";
    if (botaoBusca) botaoBusca.textContent = "Buscar por Nome";
    if (tituloBusca) tituloBusca.textContent = "Buscar por Nome";
  }
}
function limparCamposFormulario() {
  document.getElementById("idRegistro").value = "";
  document.getElementById("buscarId").value = "";
  document.getElementById("buscarNome").value = "";

  const config = getConfigAtual();

  config.campos.forEach((campo) => {
    const elemento = document.getElementById(campo.id);
    if (elemento) {
      elemento.value = "";
    }
  });
}

function coletarDadosFormulario() {
  const config = getConfigAtual();
  const dados = {};

  config.campos.forEach((campo) => {
    const input = document.getElementById(campo.id);
    let valor = input.value;

    if (campo.tipo === "number" && valor !== "") {
      valor = Number(valor);
    }

    dados[campo.id] = valor;
  });

  return dados;
}

function normalizarPayload(entidade, dados) {
  if (entidade === "clientes") {
    return {
      nome: dados.nome,
      telefone: dados.telefone,
      email: dados.email,
      rua: dados.rua,
      numero: dados.numero,
      bairro: dados.bairro,
      cidade: dados.cidade,
      complemento: dados.complemento,
    };
  }

  if (entidade === "atendentes") {
    return {
      nome: dados.nome,
      telefone: dados.telefone,
      turno: dados.turno,
    };
  }

  if (entidade === "pedidos") {
    return {
      dataPedido: dados.dataPedido,
      statusPedido: dados.statusPedido,
      formaPagamento: dados.formaPagamento,
      valorTotal: dados.valorTotal,
      observacao: dados.observacao,
      cliente: dados.idCliente ? { idCliente: Number(dados.idCliente) } : null,
      atendente: dados.idAtendente
      ? { idAtendente: Number(dados.idAtendente) }
      : null,
    };
  }

  return dados;
}

function preencherFormularioComRegistro(entidade, registro) {
  if (!registro) return;

  if (entidade === "clientes") {
    document.getElementById("nome").value = registro.nome ?? "";
    document.getElementById("telefone").value = registro.telefone ?? "";
    document.getElementById("email").value = registro.email ?? "";
    document.getElementById("rua").value = registro.rua ?? "";
    document.getElementById("numero").value = registro.numero ?? "";
    document.getElementById("bairro").value = registro.bairro ?? "";
    document.getElementById("cidade").value = registro.cidade ?? "";
    document.getElementById("complemento").value = registro.complemento ?? "";
  }

  if (entidade === "atendentes") {
    document.getElementById("nome").value = registro.nome ?? "";
    document.getElementById("telefone").value = registro.telefone ?? "";
    document.getElementById("turno").value = registro.turno ?? "";
  }

  if (entidade === "pedidos") {
    document.getElementById("dataPedido").value = registro.dataPedido ?? "";
    document.getElementById("statusPedido").value = registro.statusPedido ?? "";
    document.getElementById("formaPagamento").value =
      registro.formaPagamento ?? "";
    document.getElementById("valorTotal").value = registro.valorTotal ?? "";
    document.getElementById("observacao").value = registro.observacao ?? "";
    document.getElementById("idCliente").value = registro.cliente?.idCliente ?? "";
    document.getElementById("idAtendente").value = registro.atendente?.idAtendente ?? "";
  }
}

function formatarSituacaoBadge(situacao) {
  if (!situacao) return "-";

  const texto = String(situacao).trim().toLowerCase();

  if (texto === "aprovado") {
    return '<span class="badge badge-aprovado">Aprovado</span>';
  }

  if (texto === "reprovado") {
    return '<span class="badge badge-reprovado">Reprovado</span>';
  }

  if (texto === "recuperacao" || texto === "recuperação") {
    return '<span class="badge badge-recuperacao">Recuperação</span>';
  }

  return situacao;
}

function renderTabela(dados) {
  const lista = Array.isArray(dados) ? dados : [dados];
  const wrapper = document.getElementById("tabelaWrapper");

  if (!lista || lista.length === 0) {
    wrapper.innerHTML = '<p class="sem-dados">Nenhum registro encontrado.</p>';
    return;
  }

  let html = "<table><thead><tr>";
  const entidade = getEntidadeSelecionada();

  if (entidade === "clientes") {
    html += `
    <th>ID</th>
    <th>Nome</th>
    <th>Telefone</th>
    <th>Email</th>
    <th>Cidade</th>
    <th>Bairro</th>
  `;
  }

  if (entidade === "atendentes") {
    html += `
    <th>ID</th>
    <th>Nome</th>
    <th>Telefone</th>
    <th>Turno</th>
  `;
  }

  if (entidade === "pedidos") {
    html += `
    <th>ID</th>
    <th>Data</th>
    <th>Status</th>
    <th>Pagamento</th>
    <th>Valor</th>
    <th>Cliente</th>
    <th>Atendente</th>
  `;
  }

  html += "</tr></thead><tbody>";

  lista.forEach((item) => {
    html += "<tr>";

    if (entidade === "clientes") {
  html += `
    <td>${item.idCliente ?? ""}</td>
    <td>${item.nome ?? ""}</td>
    <td>${item.telefone ?? ""}</td>
    <td>${item.email ?? ""}</td>
    <td>${item.cidade ?? ""}</td>
    <td>${item.bairro ?? ""}</td>
  `;
}

if (entidade === "atendentes") {
  html += `
    <td>${item.idAtendente ?? ""}</td>
    <td>${item.nome ?? ""}</td>
    <td>${item.telefone ?? ""}</td>
    <td>${item.turno ?? ""}</td>
  `;
}

if (entidade === "pedidos") {
  html += `
    <td>${item.idPedido ?? ""}</td>
    <td>${item.dataPedido ?? ""}</td>
    <td>${item.statusPedido ?? ""}</td>
    <td>${item.formaPagamento ?? ""}</td>
    <td>${item.valorTotal ?? ""}</td>
    <td>${item.cliente?.nome ?? "-"}</td>
    <td>${item.atendente?.nome ?? "-"}</td>
  `;
}

    html += "</tr>";
  });

  html += "</tbody></table>";
  wrapper.innerHTML = html;
}

async function tratarResposta(resposta, mensagemErroPadrao) {
  if (!resposta.ok) {
    let textoErro = mensagemErroPadrao;

    try {
      const contentType = resposta.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const json = await resposta.json();
        textoErro = json.erro || JSON.stringify(json);
      } else {
        textoErro = await resposta.text();
      }
    } catch (e) {}

    throw new Error(textoErro);
  }

  if (resposta.status === 204) {
    return null;
  }

  const contentType = resposta.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    return await resposta.json();
  }

  return await resposta.text();
}

async function listar() {
  const config = getConfigAtual();

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}`);
    const dados = await tratarResposta(
      resposta,
      `Não foi possível listar ${config.nomeExibicao.toLowerCase()}s.`,
    );

    renderTabela(dados);
    mostrarResultado(dados);
    mostrarMensagem(
      `${config.nomeExibicao}(s) listado(s) com sucesso.`,
      "sucesso",
    );
  } catch (erro) {
    mostrarErro(erro.message);
    limparTabela();
  }
}

async function buscarId() {
  const config = getConfigAtual();
  const id = document.getElementById("buscarId").value;

  if (!id) {
    mostrarErro("Digite um ID para buscar.");
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}/${id}`);
    const dados = await tratarResposta(
      resposta,
      `${config.nomeExibicao} não encontrado.`,
    );

    renderTabela(dados);
    mostrarResultado(dados);
    mostrarMensagem(
      `${config.nomeExibicao} encontrado com sucesso.`,
      "sucesso",
    );
  } catch (erro) {
    mostrarErro(erro.message);
    limparTabela();
  }
}

async function buscarNome() {
  const config = getConfigAtual();
  const valor = document.getElementById("buscarNome").value.trim();

  if (!valor) {
    mostrarErro("Digite um valor para buscar.");
    return;
  }

  try {
    let url = "";

    if (getEntidadeSelecionada() === "pedidos") {
      url = `${API_BASE}/${config.rota}/status/${encodeURIComponent(valor)}`;
    } else {
      url = `${API_BASE}/${config.rota}/buscar/${encodeURIComponent(valor)}`;
    }

    const resposta = await fetch(url);

    const dados = await tratarResposta(
      resposta,
      `${config.nomeExibicao} não encontrado.`,
    );

    renderTabela(dados);
    mostrarResultado(dados);
    mostrarMensagem(
      `${config.nomeExibicao} encontrado com sucesso.`,
      "sucesso",
    );
  } catch (erro) {
    mostrarErro(erro.message);
    limparTabela();
  }
}

async function carregarRegistroPorIdNoFormulario() {
  const config = getConfigAtual();
  const entidade = getEntidadeSelecionada();
  const id = document.getElementById("idRegistro").value;

  if (!id) {
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}/${id}`);
    const dados = await tratarResposta(
      resposta,
      `${config.nomeExibicao} não encontrado.`,
    );

    preencherFormularioComRegistro(entidade, dados);
    renderTabela(dados);
    mostrarResultado(dados);
    mostrarMensagem(
      `${config.nomeExibicao} carregado no formulário com sucesso.`,
      "sucesso",
    );
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

async function adicionar() {
  const config = getConfigAtual();
  const entidade = getEntidadeSelecionada();
  const idRegistro = document.getElementById("idRegistro").value.trim();

  if (idRegistro !== "") {
    alert("Para adicionar um novo registro, deixe o ID em branco.");
    return;
  }

  const dados = coletarDadosFormulario();
  const payload = normalizarPayload(entidade, dados);

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultado = await tratarResposta(
      resposta,
      `Erro ao cadastrar ${config.nomeExibicao.toLowerCase()}.`,
    );

    renderTabela(resultado);
    mostrarResultado(resultado);
    mostrarMensagem(
      `${config.nomeExibicao} cadastrado com sucesso.`,
      "sucesso",
    );
    limparCamposFormulario();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

async function atualizar() {
  const config = getConfigAtual();
  const entidade = getEntidadeSelecionada();
  const id = document.getElementById("idRegistro").value;

  if (!id) {
    mostrarErro("Digite o ID do registro para atualizar.");
    return;
  }

  const dados = coletarDadosFormulario();
  const payload = normalizarPayload(entidade, dados);

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resultado = await tratarResposta(
      resposta,
      `Erro ao alterar ${config.nomeExibicao.toLowerCase()}.`,
    );

    renderTabela(resultado);
    mostrarResultado(resultado);
    mostrarMensagem(`${config.nomeExibicao} alterado com sucesso.`, "sucesso");
    limparCamposFormulario();
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

async function deletarRegistro() {
  const config = getConfigAtual();
  const id = document.getElementById("idRegistro").value;

  if (!id) {
    mostrarErro("Digite o ID do registro para deletar.");
    return;
  }

  const confirmar = confirm(
    `Tem certeza que deseja apagar este ${config.nomeExibicao.toLowerCase()}?`,
  );

  if (!confirmar) {
    mostrarMensagem("Exclusão cancelada.", "neutra");
    return;
  }

  try {
    const resposta = await fetch(`${API_BASE}/${config.rota}/${id}`, {
      method: "DELETE",
    });

    await tratarResposta(
      resposta,
      `Erro ao apagar ${config.nomeExibicao.toLowerCase()}.`,
    );

    limparCamposFormulario();
    limparTabela();
    mostrarResultado({
      mensagem: `${config.nomeExibicao} apagado com sucesso.`,
    });
    mostrarMensagem(`${config.nomeExibicao} apagado com sucesso.`, "sucesso");
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

function configurarEventos() {
  document
    .getElementById("entidade")
    .addEventListener("change", renderizarFormulario);
  document.getElementById("btnListar").addEventListener("click", listar);
  document.getElementById("btnBuscarId").addEventListener("click", buscarId);
  document
    .getElementById("btnBuscarNome")
    .addEventListener("click", buscarNome);
  document.getElementById("btnAdicionar").addEventListener("click", adicionar);
  document.getElementById("btnAtualizar").addEventListener("click", atualizar);
  document
    .getElementById("btnDeletar")
    .addEventListener("click", deletarRegistro);
  document
    .getElementById("idRegistro")
    .addEventListener("blur", carregarRegistroPorIdNoFormulario);
}

window.addEventListener("DOMContentLoaded", () => {
  configurarEventos();
  renderizarFormulario();
});
