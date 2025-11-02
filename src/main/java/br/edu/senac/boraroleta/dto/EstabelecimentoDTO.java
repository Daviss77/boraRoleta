package br.edu.senac.boraroleta.dto;

import jakarta.validation.constraints.*;

public class EstabelecimentoDTO {

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, max = 200, message = "Nome deve ter entre 3 e 200 caracteres")
    private String nome;

    @NotBlank(message = "Categoria é obrigatória")
    @Size(max = 100, message = "Categoria deve ter no máximo 100 caracteres")
    private String categoria;

    @NotBlank(message = "Endereço é obrigatório")
    private String endereco;

    @NotNull(message = "Latitude é obrigatória")
    @DecimalMin(value = "-90.0", message = "Latitude deve estar entre -90 e 90")
    @DecimalMax(value = "90.0", message = "Latitude deve estar entre -90 e 90")
    private Double latitude;

    @NotNull(message = "Longitude é obrigatória")
    @DecimalMin(value = "-180.0", message = "Longitude deve estar entre -180 e 180")
    @DecimalMax(value = "180.0", message = "Longitude deve estar entre -180 e 180")
    private Double longitude;

    @Pattern(regexp = "^\\d{10,11}$|^\\(\\d{2}\\)\\s?\\d{4,5}-\\d{4}$", 
             message = "Telefone inválido")
    private String telefone;

    @DecimalMin(value = "0.0", message = "Avaliação deve ser maior ou igual a 0")
    @DecimalMax(value = "5.0", message = "Avaliação deve ser menor ou igual a 5")
    private Double avaliacaoMedia;

    private String googlePlaceId;

    // Construtores
    public EstabelecimentoDTO() {
    }

    public EstabelecimentoDTO(String nome, String categoria, String endereco, 
                             Double latitude, Double longitude) {
        this.nome = nome;
        this.categoria = categoria;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters e Setters
    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Double getAvaliacaoMedia() {
        return avaliacaoMedia;
    }

    public void setAvaliacaoMedia(Double avaliacaoMedia) {
        this.avaliacaoMedia = avaliacaoMedia;
    }

    public String getGooglePlaceId() {
        return googlePlaceId;
    }

    public void setGooglePlaceId(String googlePlaceId) {
        this.googlePlaceId = googlePlaceId;
    }
}
