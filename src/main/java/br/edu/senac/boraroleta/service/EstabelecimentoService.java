package br.edu.senac.boraroleta.service;

import br.edu.senac.boraroleta.dto.EstabelecimentoDTO;
import br.edu.senac.boraroleta.exception.BusinessException;
import br.edu.senac.boraroleta.exception.EntityNotFoundException;
import br.edu.senac.boraroleta.model.Estabelecimento;
import br.edu.senac.boraroleta.repository.EstabelecimentoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EstabelecimentoService {

    @Autowired
    private EstabelecimentoRepository repository;

    @Transactional(readOnly = true)
    public List<Estabelecimento> listarTodos() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Estabelecimento buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estabelecimento", id));
    }

    @Transactional(readOnly = true)
    public List<Estabelecimento> buscarPorCategoria(String categoria) {
        return repository.findByCategoria(categoria);
    }

    @Transactional(readOnly = true)
    public List<Estabelecimento> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    @Transactional
    public Estabelecimento criar(EstabelecimentoDTO dto) {
        // Validação de negócio
        if (dto.getGooglePlaceId() != null && repository.existsByGooglePlaceId(dto.getGooglePlaceId())) {
            throw new BusinessException("Estabelecimento com este Google Place ID já cadastrado");
        }

        // Converte DTO para Entity
        Estabelecimento estabelecimento = new Estabelecimento();
        estabelecimento.setNome(dto.getNome());
        estabelecimento.setCategoria(dto.getCategoria());
        estabelecimento.setEndereco(dto.getEndereco());
        estabelecimento.setLatitude(dto.getLatitude());
        estabelecimento.setLongitude(dto.getLongitude());
        estabelecimento.setTelefone(dto.getTelefone());
        estabelecimento.setAvaliacaoMedia(dto.getAvaliacaoMedia());
        estabelecimento.setGooglePlaceId(dto.getGooglePlaceId());

        return repository.save(estabelecimento);
    }

    @Transactional
    public Estabelecimento atualizar(Long id, EstabelecimentoDTO dto) {
        Estabelecimento estabelecimento = buscarPorId(id);

        // Verifica se Google Place ID foi alterado e se já existe
        if (dto.getGooglePlaceId() != null && 
            !dto.getGooglePlaceId().equals(estabelecimento.getGooglePlaceId()) && 
            repository.existsByGooglePlaceId(dto.getGooglePlaceId())) {
            throw new BusinessException("Estabelecimento com este Google Place ID já cadastrado");
        }

        estabelecimento.setNome(dto.getNome());
        estabelecimento.setCategoria(dto.getCategoria());
        estabelecimento.setEndereco(dto.getEndereco());
        estabelecimento.setLatitude(dto.getLatitude());
        estabelecimento.setLongitude(dto.getLongitude());
        estabelecimento.setTelefone(dto.getTelefone());
        estabelecimento.setAvaliacaoMedia(dto.getAvaliacaoMedia());
        estabelecimento.setGooglePlaceId(dto.getGooglePlaceId());

        return repository.save(estabelecimento);
    }

    @Transactional
    public void deletar(Long id) {
        Estabelecimento estabelecimento = buscarPorId(id);
        repository.delete(estabelecimento);
    }
}
