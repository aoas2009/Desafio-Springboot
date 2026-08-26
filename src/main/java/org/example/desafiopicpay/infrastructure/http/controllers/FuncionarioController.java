package org.example.desafiopicpay.infrastructure.http.controllers;


import jakarta.validation.Valid;
import org.example.desafiopicpay.core.entity.Funcionario;
import org.example.desafiopicpay.infrastructure.http.request.RegisterRequest;
import org.example.desafiopicpay.infrastructure.http.request.UpdateFuncionarioRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.UUID;

@RestController
@RequestMapping("/api/funcionario")
public class FuncionarioController {
    ArrayList<Funcionario> lista = new ArrayList<>();

    @GetMapping("/health")
    public String health(){
        return "Everything ok!";
    }

    @PostMapping
    public ResponseEntity<Funcionario> register(@Valid @RequestBody RegisterRequest request){
        Funcionario funcionario = new Funcionario(
                request.nome(),
                request.email(),
                request.telefone() != null ? request.telefone() : "",
                request.cargo(),
                request.departamento() != null ? request.departamento() : "",
                request.salario() != null ? request.salario() : 0.0,
                request.cidade() != null ? request.cidade() : ""
        );
        lista.add(funcionario);
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionario);
    }

    @GetMapping
    public ResponseEntity<ArrayList<Funcionario>> list(){
        if (lista.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> findById(@PathVariable UUID id){
        for (Funcionario funcionario : lista) {
            if (funcionario.getId().equals(id)) {
                return ResponseEntity.ok(funcionario);
            }
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> updateFull(@PathVariable UUID id, @Valid @RequestBody RegisterRequest request){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        funcionario.setNome(request.nome());
        funcionario.setEmail(request.email());
        funcionario.setCargo(request.cargo());
        funcionario.setTelefone(request.telefone() != null ? request.telefone() : "");
        funcionario.setDepartamento(request.departamento() != null ? request.departamento() : "");
        funcionario.setSalario(request.salario() != null ? request.salario() : 0.0);
        funcionario.setCidade(request.cidade() != null ? request.cidade() : "");

        return ResponseEntity.ok(funcionario);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Funcionario> updatePartial(@PathVariable UUID id, @Valid @RequestBody UpdateFuncionarioRequest request){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (request.nome() != null) funcionario.setNome(request.nome());
        if (request.email() != null) funcionario.setEmail(request.email());
        if (request.cargo() != null) funcionario.setCargo(request.cargo());
        if (request.telefone() != null) funcionario.setTelefone(request.telefone());
        if (request.departamento() != null) funcionario.setDepartamento(request.departamento());
        if (request.salario() != null) funcionario.setSalario(request.salario());
        if (request.cidade() != null) funcionario.setCidade(request.cidade());

        return ResponseEntity.ok(funcionario);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable UUID id){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                lista.remove(f);
            }
        }
    }

}
