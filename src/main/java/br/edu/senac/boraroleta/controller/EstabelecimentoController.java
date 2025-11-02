package br.edu.senac.boraroleta.controller;

import br.edu.senac.boraroleta.dto.EstabelecimentoDTO;
import br.edu.senac.boraroleta.model.Estabelecimento;
import br.edu.senac.boraroleta.service.EstabelecimentoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estabelecimentos")
public class EstabelecimentoController {

    @Autowired
    private EstabelecimentoService service;

    @GetMapping
    public ResponseEntity<List<Estabelecimento>> listarTodos() {
        List<Estabelecimento> estabelecimentos = service.listarTodos();
        return ResponseEntity.ok(estabelecimentos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estabelecimento> buscarPorId(@PathVariable Long id) {
        Estabelecimento estabelecimento = service.buscarPorId(id);
        return ResponseEntity.ok(estabelecimento);
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Estabelecimento>> buscarPorCategoria(@PathVariable String categoria) {
        List<Estabelecimento> estabelecimentos = service.buscarPorCategoria(categoria);
        return ResponseEntity.ok(estabelecimentos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Estabelecimento>> buscarPorNome(@RequestParam String nome) {
        List<Estabelecimento> estabelecimentos = service.buscarPorNome(nome);
        return ResponseEntity.ok(estabelecimentos);
    }

    @PostMapping
    public ResponseEntity<Estabelecimento> criar(@Valid @RequestBody EstabelecimentoDTO dto) {
        Estabelecimento estabelecimento = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(estabelecimento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estabelecimento> atualizar(@PathVariable Long id, 
                                                     @Valid @RequestBody EstabelecimentoDTO dto) {
        Estabelecimento estabelecimento = service.atualizar(id, dto);
        return ResponseEntity.ok(estabelecimento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
