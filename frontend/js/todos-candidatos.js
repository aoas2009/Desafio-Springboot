async function buscarFuncionarios() {
  try {
    const response = await fetch('http://localhost:8080/api/funcionario/health');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

buscarFuncionarios();