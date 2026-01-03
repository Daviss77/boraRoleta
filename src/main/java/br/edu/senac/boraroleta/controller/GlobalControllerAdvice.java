package br.edu.senac.boraroleta.controller;

import br.edu.senac.boraroleta.model.Usuario;
import br.edu.senac.boraroleta.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class GlobalControllerAdvice {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @ModelAttribute("usuarioLogado")
    public Usuario usuarioLogado(Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        String email = authentication.getName();

        return usuarioRepository.findByEmail(email).orElse(null);
    }
}
