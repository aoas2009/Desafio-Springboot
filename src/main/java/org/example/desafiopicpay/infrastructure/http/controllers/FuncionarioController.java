package org.example.desafiopicpay.infrastructure.http.controllers;


import jakarta.validation.Valid;
import org.example.desafiopicpay.core.entity.Funcionario;
import org.example.desafiopicpay.infrastructure.http.request.RegisterRequest;
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
    public void updateFull(@PathVariable UUID id, @RequestBody Funcionario funcionario){

    }

    @PatchMapping("/{id}")
    public void updatePartial(@PathVariable UUID id, @RequestBody Funcionario funcionario){

    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable UUID id){

    }

}
