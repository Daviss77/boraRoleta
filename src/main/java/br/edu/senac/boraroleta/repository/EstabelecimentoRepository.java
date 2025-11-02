package br.edu.senac.boraroleta.repository;

import br.edu.senac.boraroleta.model.Estabelecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {
    
    List<Estabelecimento> findByCategoria(String categoria);
    
    Optional<Estabelecimento> findByGooglePlaceId(String googlePlaceId);
    
    List<Estabelecimento> findByNomeContainingIgnoreCase(String nome);
    
    boolean existsByGooglePlaceId(String googlePlaceId);
}
