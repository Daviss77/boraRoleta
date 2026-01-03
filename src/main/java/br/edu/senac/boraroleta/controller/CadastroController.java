package br.edu.senac.boraroleta.controller;

import br.edu.senac.boraroleta.model.Usuario;
import br.edu.senac.boraroleta.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class CadastroController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/cadastro")
    public String cadastro() {
        return "Cadastro/cadastro";
    }

    @PostMapping("/cadastro")
    public String cadastrarUsuario(Usuario usuario) {

        // criptografa a senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        // salva no banco
        usuarioRepository.save(usuario);

        // redireciona para login
        return "redirect:/login";
    }
}
