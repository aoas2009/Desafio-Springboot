(function () {
  const API_BASE = 'http://localhost:8080/api/funcionario';

  const CARD_IDS = ['card-total', 'card-em-analise', 'card-aprovados', 'card-contratados', 'card-recusados'];

  function setValor(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  async function carregarResumo() {
    try {
      const response = await fetch(API_BASE);

      if (response.status === 204) {
        CARD_IDS.forEach((id) => setValor(id, 0));
        return;
      }

      if (!response.ok) {
        throw new Error(`Falha ao buscar resumo (status ${response.status})`);
      }

      const funcionarios = await response.json();
      const contagem = { EM_ANALISE: 0, APROVADO: 0, CONTRATADO: 0, REPROVADO: 0 };

      funcionarios.forEach((funcionario) => {
        if (contagem[funcionario.status] !== undefined) {
          contagem[funcionario.status]++;
        }
      });

      setValor('card-total', funcionarios.length);
      setValor('card-em-analise', contagem.EM_ANALISE);
      setValor('card-aprovados', contagem.APROVADO);
      setValor('card-contratados', contagem.CONTRATADO);
      setValor('card-recusados', contagem.REPROVADO);
    } catch (error) {
      console.error('Erro:', error);
      CARD_IDS.forEach((id) => setValor(id, '—'));
    }
  }

  carregarResumo();
})();
