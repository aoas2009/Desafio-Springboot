package org.example.desafiopicpay.infrastructure.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Positive;

public record UpdatePartialRequest(
        String nome,

        @Email
        String email,

        String cargo,

        String telefone,

        String departamento,

        @Positive(message = "Salário deve ser maior que zero")
        Double salario,

        String cidade
) {
}
