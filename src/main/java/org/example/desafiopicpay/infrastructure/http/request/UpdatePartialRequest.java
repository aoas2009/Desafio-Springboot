package org.example.desafiopicpay.infrastructure.http.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.jspecify.annotations.NonNull;

public record UpdatePartialRequest(
        String nome,

        @NotNull
        String email,

        String cargo,

        String telefone,

        String departamento,

        @Positive(message = "Salário deve ser maior que zero")
        Double salario,

        String cidade
) {
}
