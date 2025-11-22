package br.edu.senac.boraroleta.repository;

import br.edu.senac.boraroleta.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByCpf(String cpf);
    
    boolean existsByEmail(String email);
    
    boolean existsByCpf(String cpf);

    // Suporte a buscas parciais para Admin
    java.util.List<Usuario> findByNomeContainingIgnoreCase(String nome);
    java.util.List<Usuario> findByEmailContainingIgnoreCase(String email);
}
