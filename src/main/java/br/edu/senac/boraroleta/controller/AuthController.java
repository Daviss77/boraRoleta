package br.edu.senac.boraroleta.controller;

import br.edu.senac.boraroleta.dto.LoginDTO;
import br.edu.senac.boraroleta.dto.LoginResponseDTO;
import br.edu.senac.boraroleta.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST para autenticação de usuários.
 * 
 * Expõe endpoints para login e gerenciamento de sessão.
 * 
 * @author Equipe Bora Roleta - SENAC 2025
 * @version 1.0
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Autentica um usuário com email/username e senha.
     * 
     * Suporta login de administrador com credenciais hard-coded (admin/admin)
     * e usuários do banco de dados com validação BCrypt.
     * 
     * @param loginDTO DTO contendo email e senha
     * @return ResponseEntity com dados do usuário autenticado (id, nome, email, isAdmin)
     * @throws RuntimeException se credenciais forem inválidas
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginDTO loginDTO) {
        LoginResponseDTO response = usuarioService.autenticar(loginDTO);
        return ResponseEntity.ok(response);
    }
}
