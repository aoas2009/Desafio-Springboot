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
    onClick: () => window.location.href = `funcionario.html?id=${funcionario.id}`,
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

async function carregarFuncionarios() {
  const section = document.querySelector('.employee-list');
  if (!section) return;

  const status = section.dataset.status || '';
  const actions = (section.dataset.actions || 'edit').split(',').map((a) => a.trim());
  const mostrarStatus = section.dataset.showStatus === 'true';

  const url = status ? `${API_BASE}?status=${status}` : API_BASE;

  try {
    const response = await fetch(url);

    section.innerHTML = '';

    if (response.status === 204) {
      section.appendChild(criarEmptyState());
      return;
    }

    if (!response.ok) {
      throw new Error(`Falha ao buscar funcionários (status ${response.status})`);
    }

    const funcionarios = await response.json();
    funcionarios.forEach((funcionario) => {
      section.appendChild(criarEmployeeRow(funcionario, actions, mostrarStatus));
    });
  } catch (error) {
    console.error('Erro:', error);
    section.innerHTML = '<p class="employee-list-empty">Erro ao carregar funcionários.</p>';
  }
}

window.carregarFuncionarios = carregarFuncionarios;
carregarFuncionarios();
