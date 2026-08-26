package org.example.desafiopicpay.core.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.example.desafiopicpay.core.valueobject.Status;

import java.util.UUID;

@Getter
@Setter
public class Funcionario {
    private UUID id;
    private String nome;
    private String email;
    private String telefone;
    private String cargo;
    private String departamento;
    private double salario;
    private String cidade;
    private Status status;

    public Funcionario(String nome, String email, String telefone, String cargo, String departamento, double salario, String cidade) {
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.cargo = cargo;
        this.departamento = departamento;
        this.salario = salario;
        this.cidade = cidade;

        this.id = UUID.randomUUID();
        this.status = Status.EM_ANALISE;
    }

    public Funcionario(String nome, String email, String cargo) {
        this.nome = nome;
        this.email = email;
        this.cargo = cargo;

        this.id = UUID.randomUUID();
        this.status = Status.EM_ANALISE;
    }

    public void negar() {
        this.status = Status.REPROVADO;
    }

    public void aceitar() {
        this.status = Status.APROVADO;
    }

    public void contratar() {
        this.status = Status.CONTRATADO;
    }


}
