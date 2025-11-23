package br.edu.senac.boraroleta.service;

import br.edu.senac.boraroleta.dto.LoginDTO;
import br.edu.senac.boraroleta.dto.LoginResponseDTO;
import br.edu.senac.boraroleta.dto.UsuarioDTO;
import br.edu.senac.boraroleta.exception.BusinessException;
import br.edu.senac.boraroleta.exception.EntityNotFoundException;
import br.edu.senac.boraroleta.model.Usuario;
import br.edu.senac.boraroleta.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario", id));
    }

    @Transactional(readOnly = true)
    public Usuario buscarPorEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario com email " + email + " não encontrado"));
    }

    @Transactional
    public Usuario criar(UsuarioDTO dto) {
        // Validações de negócio
        if (repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }
        
        if (repository.existsByCpf(dto.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        // Converte DTO para Entity
        Usuario usuario = new Usuario();
        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());

        String senhaCriptografada = passwordEncoder.encode(dto.getSenha());
        usuario.setSenha(senhaCriptografada);

        return repository.save(usuario);

    }


    @Transactional
    public Usuario atualizar(Long id, UsuarioDTO dto) {
        Usuario usuario = buscarPorId(id);

        // Verifica se email foi alterado e se já existe
        if (!usuario.getEmail().equals(dto.getEmail()) && repository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email já cadastrado");
        }

        // Verifica se CPF foi alterado e se já existe
        if (!usuario.getCpf().equals(dto.getCpf()) && repository.existsByCpf(dto.getCpf())) {
            throw new BusinessException("CPF já cadastrado");
        }

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        usuario.setCpf(dto.getCpf());
        usuario.setTelefone(dto.getTelefone());

        if(dto.getSenha() != null && !dto.getSenha().isBlank()){
            String senhaCriptografada =  passwordEncoder.encode(dto.getSenha());
            usuario.setSenha(senhaCriptografada);
        }

        return repository.save(usuario);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = buscarPorId(id);
        repository.delete(usuario);
    }

    @Transactional(readOnly = true)
    public List<Usuario> buscar(String q, String nome, String email, String cpf) {
        // Estratégia: prioriza filtros específicos; se apenas 'q' vier, busca em nome/email e cpf exato
        if (cpf != null && !cpf.isBlank()) {
            return repository.findByCpf(cpf).map(java.util.List::of).orElseGet(java.util.List::of);
        }
        if (email != null && !email.isBlank()) {
            return repository.findByEmailContainingIgnoreCase(email);
        }
        if (nome != null && !nome.isBlank()) {
            return repository.findByNomeContainingIgnoreCase(nome);
        }
        if (q != null && !q.isBlank()) {
            // se 'q' parece cpf, tenta cpf
            var possivelCpf = q.replaceAll("[^0-9]", "");
            var resultado = new java.util.ArrayList<Usuario>();
            if (possivelCpf.length() >= 11) {
                repository.findByCpf(q).ifPresent(resultado::add);
            }
            // nome/email parciais
            resultado.addAll(repository.findByNomeContainingIgnoreCase(q));
            resultado.addAll(repository.findByEmailContainingIgnoreCase(q));
            // remover duplicatas preservando ordem
            Map<Long, Usuario> unique = new LinkedHashMap<>();
            for (var u : resultado) unique.put(u.getId(), u);
            return new java.util.ArrayList<>(unique.values());
        }
        // sem filtros, retorna todos
        return listarTodos();
    }

    @Transactional(readOnly = true)
    public LoginResponseDTO autenticar(LoginDTO loginDTO) {
        // Verificar login de admin
        if ("admin".equals(loginDTO.getEmail()) && "admin".equals(loginDTO.getSenha())) {
            return new LoginResponseDTO(0L, "ADMIN", "admin", true);
        }

        // Buscar usuário por email
        Usuario usuario = repository.findByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new BusinessException("Email ou senha inválidos"));

        // Verificar senha
        if (!passwordEncoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            throw new BusinessException("Email ou senha inválidos");
        }

        // Retornar dados do usuário
        return new LoginResponseDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.isAdmin()
        );
    }
}
