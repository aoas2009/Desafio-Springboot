(function () {
  const MODAL_HTML = `
    <div class="modal-overlay" id="detalhes-overlay" hidden>
      <div class="modal">
        <div class="modal-header">
          <h2>Detalhes do Candidato</h2>
          <button class="modal-close" type="button" id="detalhes-close" aria-label="Fechar">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-photo placeholder-icon">
            <img class="detail-avatar" src="../assets/user_placeholder.jpg" alt="">
          </div>
          <div class="modal-form detail-grid">
            <div class="detail-field">
              <span class="detail-label">Nome</span>
              <span class="detail-value" data-field="nome"></span>
            </div>
            <div class="detail-field">
              <span class="detail-label">Email</span>
              <span class="detail-value" data-field="email"></span>
            </div>
            <div class="detail-field">
              <span class="detail-label">Status</span>
              <span class="detail-value" data-field="status"></span>
            </div>
            <div class="form-row">
              <div class="detail-field">
                <span class="detail-label">Cargo</span>
                <span class="detail-value" data-field="cargo"></span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Departamento</span>
                <span class="detail-value" data-field="departamento"></span>
              </div>
            </div>
            <div class="form-row">
              <div class="detail-field">
                <span class="detail-label">Telefone</span>
                <span class="detail-value" data-field="telefone"></span>
              </div>
              <div class="detail-field">
                <span class="detail-label">Cidade</span>
                <span class="detail-value" data-field="cidade"></span>
              </div>
            </div>
            <div class="detail-field">
              <span class="detail-label">Salário</span>
              <span class="detail-value" data-field="salario"></span>
            </div>
            <div class="detail-field">
              <span class="detail-label">ID</span>
              <span class="detail-value detail-value--id" data-field="id"></span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-edit" id="detalhes-editar-btn">
            <span><img src="../assets/icons/document_icon.svg" alt=""></span>
            Editar
          </button>
          <button type="button" class="btn btn-secondary" id="detalhes-fechar-btn">Fechar</button>
        </div>
      </div>
    </div>
  `;

  const STATUS_TEXTO = {
    EM_ANALISE: 'Em análise',
    APROVADO: 'Aprovado',
    CONTRATADO: 'Contratado',
    REPROVADO: 'Recusado',
  };

  function naoInformadoSeVazio(valor) {
    if (valor === null || valor === undefined || valor === '') return 'Não informado';
    return valor;
  }

  function formatarSalario(salario) {
    if (!salario) return 'Não informado';
    return Number(salario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const overlay = document.getElementById('detalhes-overlay');
    const modal = overlay.querySelector('.modal');

    let funcionarioAtual = null;

    const preencher = (campo, valor) => {
      modal.querySelector(`[data-field="${campo}"]`).textContent = valor;
    };

    const fechar = () => {
      overlay.hidden = true;
    };

    document.getElementById('detalhes-close').addEventListener('click', fechar);
    document.getElementById('detalhes-fechar-btn').addEventListener('click', fechar);
    document.getElementById('detalhes-editar-btn').addEventListener('click', () => {
      if (!funcionarioAtual || typeof window.mostrarEdicaoFuncionario !== 'function') return;
      fechar();
      window.mostrarEdicaoFuncionario(funcionarioAtual);
    });
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) fechar();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !overlay.hidden) fechar();
    });

    window.mostrarDetalhesFuncionario = (funcionario) => {
      funcionarioAtual = funcionario;
      preencher('nome', naoInformadoSeVazio(funcionario.nome));
      preencher('email', naoInformadoSeVazio(funcionario.email));
      preencher('status', STATUS_TEXTO[funcionario.status] ?? funcionario.status);
      preencher('cargo', naoInformadoSeVazio(funcionario.cargo));
      preencher('departamento', naoInformadoSeVazio(funcionario.departamento));
      preencher('telefone', naoInformadoSeVazio(funcionario.telefone));
      preencher('cidade', naoInformadoSeVazio(funcionario.cidade));
      preencher('salario', formatarSalario(funcionario.salario));
      preencher('id', funcionario.id);

      overlay.hidden = false;
    };
  });
})();
