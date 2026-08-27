(function () {
  const API_BASE = 'http://localhost:8080/api/funcionario';

  const MODAL_HTML = `
    <div class="modal-overlay" id="editar-overlay" hidden>
      <div class="modal">
        <div class="modal-header">
          <h2>Editar Candidato</h2>
          <button class="modal-close" type="button" id="editar-close" aria-label="Fechar">&times;</button>
        </div>
        <form id="editar-form">
          <div class="modal-body">
            <div class="modal-photo placeholder-icon">
              <img src="../assets/icons/all_workers.svg" alt="">
            </div>
            <div class="modal-form">
              <div class="form-field">
                <label for="editar-nome">Nome <span class="required">*</span></label>
                <input type="text" id="editar-nome" name="nome" required>
              </div>
              <div class="form-field">
                <label for="editar-email">Email <span class="required">*</span></label>
                <input type="email" id="editar-email" name="email" required>
              </div>
              <div class="form-field">
                <label for="editar-cargo">Cargo <span class="required">*</span></label>
                <input type="text" id="editar-cargo" name="cargo" required>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="editar-telefone">Telefone</label>
                  <input type="text" id="editar-telefone" name="telefone">
                </div>
                <div class="form-field">
                  <label for="editar-departamento">Departamento</label>
                  <input type="text" id="editar-departamento" name="departamento">
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  <label for="editar-salario">Salário</label>
                  <input type="number" id="editar-salario" name="salario" min="0" step="0.01">
                </div>
                <div class="form-field">
                  <label for="editar-cidade">Cidade</label>
                  <input type="text" id="editar-cidade" name="cidade">
                </div>
              </div>
              <span class="form-error" id="editar-error"></span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="editar-cancelar">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const overlay = document.getElementById('editar-overlay');
    const form = document.getElementById('editar-form');
    const errorEl = document.getElementById('editar-error');

    let funcionarioId = null;

    const fechar = () => {
      overlay.hidden = true;
    };

    document.getElementById('editar-close').addEventListener('click', fechar);
    document.getElementById('editar-cancelar').addEventListener('click', fechar);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) fechar();
    });

    window.mostrarEdicaoFuncionario = (funcionario) => {
      funcionarioId = funcionario.id;
      errorEl.textContent = '';

      form.nome.value = funcionario.nome ?? '';
      form.email.value = funcionario.email ?? '';
      form.cargo.value = funcionario.cargo ?? '';
      form.telefone.value = funcionario.telefone ?? '';
      form.departamento.value = funcionario.departamento ?? '';
      form.salario.value = funcionario.salario ? funcionario.salario : '';
      form.cidade.value = funcionario.cidade ?? '';

      overlay.hidden = false;
    };

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
        const response = await fetch(`${API_BASE}/${funcionarioId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const erro = await response.json().catch(() => null);
          throw new Error(erro?.message || `Falha ao editar (status ${response.status})`);
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
