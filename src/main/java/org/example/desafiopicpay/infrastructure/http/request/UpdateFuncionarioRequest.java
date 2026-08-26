package org.example.desafiopicpay.infrastructure.http.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;

public record UpdateFuncionarioRequest(
        String nome,

        @Email(message = "Email inválido")
        String email,

        String cargo,

        String telefone,

        String departamento,

        @Positive(message = "Salário deve ser maior que zero")
        Double salario,

        String cidade
) {
}
