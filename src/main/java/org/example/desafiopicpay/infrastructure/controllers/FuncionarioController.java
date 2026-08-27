package org.example.desafiopicpay.infrastructure.controllers;


import java.util.ArrayList;
import java.util.UUID;

import org.example.desafiopicpay.core.entity.Funcionario;
import org.example.desafiopicpay.core.valueobject.Status;
import org.example.desafiopicpay.infrastructure.request.RegisterRequest;
import org.example.desafiopicpay.infrastructure.request.UpdateFullRequest;
import org.example.desafiopicpay.infrastructure.request.UpdatePartialRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

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
    public ResponseEntity<ArrayList<Funcionario>> list(@RequestParam(required = false) String status){
        ArrayList<Funcionario> resultado = lista;

        if (status != null) {
            resultado = new ArrayList<>();
            for (Funcionario f : lista) {
                if (f.getStatus() == Status.valueOf(status)) {
                    resultado.add(f);
                }
            }
        }

        if (resultado.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.ok(resultado);
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
    public ResponseEntity<Funcionario> updateFull(@PathVariable UUID id, @Valid @RequestBody UpdateFullRequest request){
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
    public ResponseEntity<Funcionario> updatePartial(@PathVariable UUID id, @Valid @RequestBody UpdatePartialRequest request){
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

    @GetMapping("/{id}/aceitar")
    public ResponseEntity<Funcionario> aceitar(@PathVariable UUID id){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        funcionario.aceitar();

        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/{id}/contratar")
    public ResponseEntity<Funcionario> contratar(@PathVariable UUID id){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        funcionario.contratar();

        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/{id}/recusar")
    public ResponseEntity<Funcionario> recusar(@PathVariable UUID id){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        funcionario.negar();

        return ResponseEntity.ok(funcionario);
    }

    @GetMapping("/{id}/recuperar")
    public ResponseEntity<Funcionario> recuperar(@PathVariable UUID id){
        Funcionario funcionario = null;
        for (Funcionario f : lista) {
            if (f.getId().equals(id)) {
                funcionario = f;
            }
        }

        if (funcionario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        funcionario.recuperar();

        return ResponseEntity.ok(funcionario);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable UUID id){
        lista.removeIf(f -> f.getId().equals(id));
    }
}
