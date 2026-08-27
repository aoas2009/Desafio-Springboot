(function () {
  const MODAL_HTML = `
    <div class="modal-overlay" id="cadastro-overlay" hidden>
      <div class="modal">
        <div class="modal-header">
          <h2>Cadastrar Candidato</h2>
          <button class="modal-close" type="button" id="cadastro-close" aria-label="Fechar">&times;</button>
        </div>
        <form id="cadastro-form">
          <div class="modal-body">
            <div class="modal-photo placeholder-icon">
              <img src="../assets/icons/all_workers.svg" alt="">
            </div>
            <div class="modal-form">
              <div class="form-field">
                <label for="cadastro-nome">Nome <span class="required">*</span></label>
                <input type="text" id="cadastro-nome" name="nome" required>
              </div>
              <div class="form-field">
                <label for="cadastro-email">Email <span class="required">*</span></label>
                <input type="email" id="cadastro-email" name="email" required>
              </div>
              <div class="form-field">
                <label for="cadastro-cargo">Cargo <span class="required">*</span></label>
                <input type="text" id="cadastro-cargo" name="cargo" required>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="cadastro-telefone">Telefone</label>
                  <input type="text" id="cadastro-telefone" name="telefone">
                </div>
                <div class="form-field">
                  <label for="cadastro-departamento">Departamento</label>
                  <input type="text" id="cadastro-departamento" name="departamento">
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="cadastro-salario">Salário</label>
                  <input type="number" id="cadastro-salario" name="salario" min="0" step="0.01">
                </div>
                <div class="form-field">
                  <label for="cadastro-cidade">Cidade</label>
                  <input type="text" id="cadastro-cidade" name="cidade">
                </div>
              </div>
              <span class="form-error" id="cadastro-error"></span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="cadastro-cancelar">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const overlay = document.getElementById('cadastro-overlay');
    const form = document.getElementById('cadastro-form');
    const errorEl = document.getElementById('cadastro-error');
    const abrirBtn = document.querySelector('.btn-primary');

    const abrir = () => {
      form.reset();
      errorEl.textContent = '';
      overlay.hidden = false;
    };

    const fechar = () => {
      overlay.hidden = true;
    };

    if (abrirBtn) {
      abrirBtn.addEventListener('click', abrir);
    }

    document.getElementById('cadastro-close').addEventListener('click', fechar);
    document.getElementById('cadastro-cancelar').addEventListener('click', fechar);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) fechar();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl.textContent = '';

      const formData = new FormData(form);
      const payload = {
        nome: formData.get('nome')?.trim(),
        email: formData.get('email')?.trim(),
        cargo: formData.get('cargo')?.trim(),
        telefone: formData.get('telefone')?.trim() || null,
        departamento: formData.get('departamento')?.trim() || null,
        salario: formData.get('salario') ? Number(formData.get('salario')) : null,
        cidade: formData.get('cidade')?.trim() || null,
      };

      try {
        const response = await fetch('http://localhost:8080/api/funcionario', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const erro = await response.json().catch(() => null);
          throw new Error(erro?.message || `Falha ao cadastrar (status ${response.status})`);
        }

        fechar();
        if (typeof window.carregarFuncionarios === 'function') {
          window.carregarFuncionarios();
        }
      } catch (error) {
        errorEl.textContent = error.message;
      }
    });
  });
})();
