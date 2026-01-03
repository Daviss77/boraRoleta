package br.edu.senac.boraroleta.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller responsável por renderizar as páginas principais da aplicação.
 * <p>
 * Este controller gerencia as rotas para a página inicial e páginas institucionais,
 * retornando os templates Thymeleaf correspondentes.
 * </p>
 *
 * @author Equipe Bora Roleta - SENAC
 * @version 1.0
 * @since 2025
 */
@Controller
public class HomeController {

    /**
     * Renderiza a página inicial da aplicação.
     * <p>
     * A página inicial carrega o mapa interativo com Google Maps API
     * e permite aos usuários buscar estabelecimentos por categoria.
     * </p>
     *
     * @return nome do template Thymeleaf "index"
     */
    @GetMapping({"/", "/home", "/index"})
    public String home() {
        return "home";
    }

    /**
     * Renderiza a página de planos e assinaturas.
     * <p>
     * Apresenta os diferentes planos disponíveis para os usuários
     * da plataforma, com detalhes de benefícios e preços.
     * </p>
     *
     * @return nome do template Thymeleaf "planos"
     */
    @GetMapping("/planos")
    public String planos() {
        return "planos";
    }

    @GetMapping("/perfil")
    public String perfil() {
        return "Perfil/perfil";
    }
}

