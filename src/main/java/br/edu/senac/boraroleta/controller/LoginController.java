package br.edu.senac.boraroleta.controller;

import br.edu.senac.boraroleta.model.Usuario;
import br.edu.senac.boraroleta.service.UsuarioService;
import br.edu.senac.boraroleta.exception.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String login() {
        return "Login/login";
    }

    @PostMapping("/login")
    public String loginSubmit(@RequestParam String email,
                              @RequestParam String senha,
                              HttpSession session,
                              Model model) {
        try {
            Usuario usuario = usuarioService.buscarPorEmail(email); // pega usuário do banco

            if (passwordEncoder.matches(senha, usuario.getSenha())) {
                // salva usuário na sessão
                session.setAttribute("usuarioLogado", usuario);
                return "redirect:/"; // redireciona para página do usuário
            } else {
                model.addAttribute("erro", "Senha incorreta");
                return "Login/login";
            }

        } catch (Exception e) {
            model.addAttribute("erro", "Usuário não encontrado");
            return "Login/login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
