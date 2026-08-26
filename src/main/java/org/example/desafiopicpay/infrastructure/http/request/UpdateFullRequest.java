package org.example.desafiopicpay.infrastructure.http.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.NonNull;

public record UpdateFullRequest(
        @NotNull
        String nome,

        @NotNull
        @Email(message = "Email inválido")
        String email,

        @NotNull
        String cargo,

        String telefone,

        String departamento,

        @Positive(message = "Salário deve ser maior que zero")
        Double salario,

        String cidade
) {
}
