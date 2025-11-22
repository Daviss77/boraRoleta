# Backend - Arquitetura Java Spring Boot

Este diretório contém todo o código backend da aplicação **BoraRoleta**, organizado em camadas seguindo os princípios de arquitetura limpa e padrões do Spring Framework.

## Estrutura de Pacotes

```
br.edu.senac.boraroleta/
├── controller/          # Camada de apresentação (REST + Web)
├── service/             # Camada de lógica de negócio
├── repository/          # Camada de acesso a dados (JPA)
├── model/               # Entidades JPA (domínio)
├── dto/                 # Data Transfer Objects
├── exception/           # Exceções customizadas e handlers
├── config/              # Configurações da aplicação
└── BoraRoletaApplication.java  # Classe principal
```

---

## Camada: controller/

**Responsabilidade:** Receber requisições HTTP, validar entrada, delegar ao service e retornar resposta.

### Controllers disponíveis:

- **`HomeController.java`**
  - Gerencia rotas de páginas web (Thymeleaf)
  - `GET /` → Página inicial com mapa
  - `GET /planos` → Página de planos

- **`UsuarioController.java`** (planejado)
  - Endpoints REST para CRUD de usuários
  - `POST /api/usuarios` → Criar usuário
  - `GET /api/usuarios/{id}` → Buscar por ID

- **`EstabelecimentoController.java`** (planejado)
  - Endpoints REST para CRUD de estabelecimentos
  - `GET /api/estabelecimentos` → Listar todos
  - `GET /api/estabelecimentos/proximos` → Busca por proximidade

**Boas práticas:**
- Sempre validar DTOs com `@Valid`
- Retornar status HTTP apropriados (201 Created, 204 No Content)
- Não incluir lógica de negócio; delegar para Services

---

## Camada: service/

**Responsabilidade:** Implementar regras de negócio, coordenar transações, validar domínio.

### Services disponíveis:

- **`UsuarioService.java`** (planejado)
  - Validações de negócio (email único, senha forte)
  - Lógica de autenticação/autorização
  - Orquestração com múltiplos repositories

- **`EstabelecimentoService.java`** (planejado)
  - Integração com Google Places API
  - Cálculo de distâncias e proximidade
  - Validação de horários de funcionamento

**Boas práticas:**
- Métodos transacionais com `@Transactional`
- Lançar exceções de negócio customizadas (ex: `BusinessException`)
- Evitar acoplamento com detalhes HTTP (não usar HttpServletRequest)

---

## Camada: repository/

**Responsabilidade:** Abstrair acesso ao banco de dados usando Spring Data JPA.

### Repositories disponíveis:

- **`UsuarioRepository.java`** (planejado)
  - Métodos de query derivados: `findByEmail()`, `existsByEmail()`
  - Query methods customizadas com `@Query`

- **`EstabelecimentoRepository.java`** (planejado)
  - Busca espacial (por coordenadas e raio)
  - Filtros por categoria e avaliação

**Boas práticas:**
- Extend `JpaRepository<Entity, ID>`
- Usar nomenclatura clara nos métodos (`findBy`, `existsBy`, `countBy`)
- Preferir query methods derivados; usar `@Query` apenas quando necessário

---

## Camada: model/

**Responsabilidade:** Representar o domínio da aplicação com entidades JPA mapeadas para tabelas.

### Entidades disponíveis:

- **`Usuario.java`** (planejado)
  - Atributos: `id`, `nome`, `email`, `senha`, `dataCadastro`
  - Relacionamentos: One-to-Many com `Avaliacao`

- **`Estabelecimento.java`** (planejado)
  - Atributos: `id`, `nome`, `endereco`, `latitude`, `longitude`, `categoria`
  - Relacionamentos: One-to-Many com `Avaliacao`

**Boas práticas:**
- Usar anotações JPA: `@Entity`, `@Table`, `@Column`
- Sempre definir `@Id` e `@GeneratedValue`
- Evitar lógica de negócio nas entidades (anêmicas)
- Implementar `equals()` e `hashCode()` baseado no ID

---

## Camada: dto/

**Responsabilidade:** Objetos para transferência de dados entre camadas, evitando exposição de entidades.

### DTOs disponíveis:

- **`UsuarioDTO.java`** (planejado)
  - Usado para criar/atualizar usuário (não expõe senha)
  - Validações com Bean Validation (`@NotBlank`, `@Email`)

- **`EstabelecimentoDTO.java`** (planejado)
  - Representação simplificada de estabelecimento para API

**Boas práticas:**
- Usar DTOs em controllers, nunca expor entidades diretamente
- Aplicar validações com `@Valid` e anotações Bean Validation
- Converter Entity ↔ DTO usando MapStruct ou métodos manuais

---

## Camada: exception/

**Responsabilidade:** Exceções customizadas e tratamento centralizado de erros.

### Classes disponíveis:

- **`GlobalExceptionHandler.java`** (planejado)
  - Anotado com `@ControllerAdvice`
  - Trata exceções globalmente (404, 400, 500)

- **`EntityNotFoundException.java`** (planejado)
  - Lançada quando recurso não é encontrado (404)

- **`BusinessException.java`** (planejado)
  - Lançada para violações de regras de negócio (400/422)

**Boas práticas:**
- Sempre retornar JSON padronizado com `{ "message": "...", "timestamp": "..." }`
- Logar erros internos mas não expor stack traces ao cliente
- Usar status HTTP corretos (404, 400, 500)

---

## Camada: config/

**Responsabilidade:** Configurações adicionais da aplicação (CORS, segurança, beans customizados).

### Configurações disponíveis:

- **`WebConfig.java`** (planejado)
  - Configuração de CORS
  - Interceptors customizados

- **`SecurityConfig.java`** (planejado)
  - Configuração do Spring Security
  - Autenticação JWT (se aplicável)

**Boas práticas:**
- Usar anotação `@Configuration`
- Definir beans com `@Bean` para objetos reutilizáveis
- Externalizar valores com `@Value("${propriedade}")`

---

## Classe Principal

**`BoraRoletaApplication.java`**

Ponto de entrada da aplicação Spring Boot.

```java
@SpringBootApplication
public class BoraRoletaApplication {
    public static void main(String[] args) {
        SpringApplication.run(BoraRoletaApplication.class, args);
    }
}
```

---

## Padrões e Convenções

### Nomenclatura
- **Classes:** PascalCase (`UsuarioService`)
- **Métodos:** camelCase (`buscarPorId`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_TENTATIVAS`)

### Anotações Spring comuns
- `@RestController` → Controllers REST
- `@Service` → Camada de serviço
- `@Repository` → Camada de persistência
- `@Entity` → Entidades JPA
- `@Transactional` → Métodos transacionais
- `@Valid` → Validação de DTOs

### Injeção de Dependências
Preferir **construtor** ao invés de `@Autowired`:

```java
@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    
    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }
}
```

---

## Testes

Testes unitários e de integração estão em `src/test/java/`.

- Use `@SpringBootTest` para testes de integração
- Use `@WebMvcTest` para testar controllers isoladamente
- Use `@DataJpaTest` para testar repositories

Execute com:

```powershell
.\mvnw.cmd test
```

---

## Recursos Úteis

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Data JPA](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/)
- [Bean Validation](https://beanvalidation.org/)
- [MapStruct](https://mapstruct.org/)

---

**Autor:** Equipe Bora Roleta - SENAC  
**Versão:** 1.0  
**Última atualização:** 2025
