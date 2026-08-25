package org.example.desafiopicpay.infrastructure.http.controllers;


import org.example.desafiopicpay.core.entity.Funcionario;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/Funcionario")
public class FuncionarioController {

    @GetMapping("/health")
    public String health(){
        return "Everything ok!";
    }

    @PostMapping
    public void register(){

    }

    @GetMapping
    public void list(){

    }

    @GetMapping("/{id}")
    public void findById(@PathVariable UUID id){

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
