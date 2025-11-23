package br.edu.senac.boraroleta.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object para requisição de login.
 * 
 * Contém as credenciais do usuário (email/username e senha) para autenticação.
 * 
 * @author Equipe Bora Roleta - SENAC 2025
 * @version 1.0
 */
public class LoginDTO {

    /**
     * Email ou username do usuário.
     * Pode ser um email válido ou o username "admin".
     */
    @NotBlank(message = "Email/Usuário é obrigatório")
    private String email;

    /**
     * Senha do usuário em texto plano.
     * Será validada contra hash BCrypt ou senha hard-coded do admin.
     */
    @NotBlank(message = "Senha é obrigatória")
    private String senha;

    // Getters e Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
}
