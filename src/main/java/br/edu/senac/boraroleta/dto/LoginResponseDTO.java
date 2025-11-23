package br.edu.senac.boraroleta.dto;

/**
 * Data Transfer Object para resposta de login.
 * 
 * Retorna os dados do usuário autenticado para armazenamento no frontend.
 * 
 * @author Equipe Bora Roleta - SENAC 2025
 * @version 1.0
 */
public class LoginResponseDTO {
    
    /** ID único do usuário (null para admin hard-coded) */
    private Long id;
    
    /** Nome completo do usuário */
    private String nome;
    
    /** Email do usuário */
    private String email;
    
    /** Flag indicando se o usuário tem permissões de administrador */
    private boolean isAdmin;

    /**
     * Construtor com todos os campos.
     * 
     * @param id ID do usuário (pode ser null para admin)
     * @param nome Nome completo
     * @param email Email ou username
     * @param isAdmin True se o usuário é administrador
     */
    public LoginResponseDTO(Long id, String nome, String email, boolean isAdmin) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }
}
