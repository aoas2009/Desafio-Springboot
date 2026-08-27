const API_BASE = 'http://localhost:8080/api/funcionario';

const STATUS_LABELS = {
  EM_ANALISE: { texto: 'Em análise', classe: 'status-pending' },
  APROVADO: { texto: 'Aprovado', classe: 'status-approved' },
  CONTRATADO: { texto: 'Contratado', classe: 'status-hired' },
  REPROVADO: { texto: 'Recusado', classe: 'status-rejected' },
};

const ACTION_BUILDERS = {
  undo: (funcionario) => criarBotaoAcao({
    classe: 'btn-undo',
    icone: '../assets/icons/undo_icon.svg',
    onClick: () => chamarAcao(funcionario.id, 'recuperar'),
  }),
  reject: (funcionario) => criarBotaoAcao({
    classe: 'btn-reject',
    icone: '../assets/icons/close_icon.svg',
    onClick: () => chamarAcao(funcionario.id, 'recusar'),
  }),
  approve: (funcionario) => criarBotaoAcao({
    classe: 'btn-approve',
    icone: '../assets/icons/check_icon.svg',
    onClick: () => chamarAcao(funcionario.id, 'aceitar'),
  }),
  hire: (funcionario) => criarBotaoAcao({
    classe: 'btn-approve',
    icone: '../assets/icons/double_check_icon.svg',
    onClick: () => chamarAcao(funcionario.id, 'contratar'),
  }),
  edit: (funcionario) => criarBotaoAcao({
    classe: 'btn-edit',
    icone: '../assets/icons/info_icon.svg',
    onClick: () => window.mostrarDetalhesFuncionario(funcionario),
  }),
};

function criarBotaoAcao({ classe, icone, onClick }) {
  const botao = document.createElement('button');
  botao.className = `btn ${classe}`;
  botao.type = 'button';
  botao.innerHTML = `<img src="${icone}" alt="">`;
  botao.addEventListener('click', onClick);
  return botao;
}

function criarEmployeeRow(funcionario, actions, mostrarStatus) {
  const article = document.createElement('article');
  article.className = 'employee-row';

  const status = STATUS_LABELS[funcionario.status] ?? { texto: funcionario.status, classe: '' };

  article.innerHTML = `
    <div class="employee-info">
      <img class="employee-avatar placeholder-icon" src="../assets/user_placeholder.jpg" alt="">
      <div class="employee-text">
        <span class="employee-name">${funcionario.nome}</span>
        <span class="employee-role">${funcionario.cargo}</span>
        ${mostrarStatus ? `<span class="employee-status ${status.classe}">${status.texto}</span>` : ''}
      </div>
    </div>
    <div class="employee-actions"></div>
  `;

  const actionsContainer = article.querySelector('.employee-actions');
  actions.forEach((acao) => {
    const builder = ACTION_BUILDERS[acao];
    if (builder) {
      actionsContainer.appendChild(builder(funcionario));
    }
  });

  return article;
}

function criarBuscaVazia(termo) {
  const container = document.createElement('div');
  container.className = 'empty-state';

  const texto = document.createElement('p');
  texto.className = 'empty-state-text';
  texto.textContent = `Nenhum candidato encontrado para "${termo}".`;
  container.appendChild(texto);

  return container;
}

function criarEmptyState() {
  const naTelaDeTodosCandidatos = window.location.pathname.endsWith('funcionarios.html');

  const container = document.createElement('div');
  container.className = 'empty-state';

  const texto = document.createElement('p');
  texto.className = 'empty-state-text';
  texto.textContent = naTelaDeTodosCandidatos
    ? 'Nenhum candidato cadastrado ainda.'
    : 'Nenhum candidato encontrado.';
  container.appendChild(texto);

  if (!naTelaDeTodosCandidatos) {
    const link = document.createElement('a');
    link.className = 'btn btn-goto';
    link.href = 'funcionarios.html';
    link.innerHTML = '<span><img src="../assets/icons/all_workers.svg" alt=""></span>Ir para Todos Candidatos';
    container.appendChild(link);
  }

  return container;
}

async function chamarAcao(id, endpoint) {
  try {
    const response = await fetch(`${API_BASE}/${id}/${endpoint}`);
    if (!response.ok) {
      throw new Error(`Falha ao executar ${endpoint} (status ${response.status})`);
    }
    await carregarFuncionarios();
  } catch (error) {
    console.error('Erro:', error);
  }
}

let ultimaListaFuncionarios = [];
let termoBuscaAtual = '';

function renderizarFuncionarios(funcionarios) {
  const section = document.querySelector('.employee-list');
  if (!section) return;

  const actions = (section.dataset.actions || 'edit').split(',').map((a) => a.trim());
  const mostrarStatus = section.dataset.showStatus === 'true';

  section.innerHTML = '';

  if (funcionarios.length === 0) {
    section.appendChild(termoBuscaAtual ? criarBuscaVazia(termoBuscaAtual) : criarEmptyState());
    return;
  }

  funcionarios.forEach((funcionario) => {
    section.appendChild(criarEmployeeRow(funcionario, actions, mostrarStatus));
  });
}

function aplicarBusca(termo) {
  termoBuscaAtual = (termo || '').trim();

  if (!termoBuscaAtual) {
    renderizarFuncionarios(ultimaListaFuncionarios);
    return;
  }

  const termoNormalizado = termoBuscaAtual.toLowerCase();
  const filtrados = ultimaListaFuncionarios.filter((funcionario) =>
    (funcionario.nome || '').toLowerCase().includes(termoNormalizado)
  );
  renderizarFuncionarios(filtrados);
}

function configurarBusca() {
  const searchBox = document.querySelector('.search-box');
  if (!searchBox) return;

  const input = searchBox.querySelector('input');
  const botao = searchBox.querySelector('.search-btn');
  if (!input) return;

  input.addEventListener('input', () => aplicarBusca(input.value));
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      aplicarBusca(input.value);
    }
  });
  if (botao) {
    botao.addEventListener('click', () => aplicarBusca(input.value));
  }
}

async function carregarFuncionarios() {
  const section = document.querySelector('.employee-list');
  if (!section) return;

  const status = section.dataset.status || '';
  const url = status ? `${API_BASE}?status=${status}` : API_BASE;

  try {
    const response = await fetch(url);

    if (response.status === 204) {
      ultimaListaFuncionarios = [];
      renderizarFuncionarios([]);
      return;
    }

    if (!response.ok) {
      throw new Error(`Falha ao buscar funcionários (status ${response.status})`);
    }

    ultimaListaFuncionarios = await response.json();
    aplicarBusca(termoBuscaAtual);
  } catch (error) {
    console.error('Erro:', error);
    section.innerHTML = '<p class="employee-list-empty">Erro ao carregar funcionários.</p>';
  }
}

window.carregarFuncionarios = carregarFuncionarios;
configurarBusca();
carregarFuncionarios();
