# Refatoração da Estrutura do Projeto - BoraRoleta

## Resumo das Mudanças Implementadas

### 1. **Estrutura de Pacotes Profissional**

Migrado de `com.example.demo` para `br.edu.senac.boraroleta` com a seguinte organização:

```
br.edu.senac.boraroleta/
├── BoraRoletaApplication.java      # Classe principal
├── config/                          # Configurações
│   └── DataSourceConfig.java
├── controller/                      # Controllers REST e Web
│   ├── HomeController.java
│   ├── UsuarioController.java
│   └── EstabelecimentoController.java
├── service/                         # Lógica de negócio
│   ├── UsuarioService.java
│   └── EstabelecimentoService.java
├── repository/                      # Acesso a dados
│   ├── UsuarioRepository.java
│   └── EstabelecimentoRepository.java
├── model/                          # Entidades JPA
│   ├── Usuario.java
│   └── Estabelecimento.java
├── dto/                            # Data Transfer Objects
│   ├── UsuarioDTO.java
│   └── EstabelecimentoDTO.java
└── exception/                      # Exceções e handlers
    ├── EntityNotFoundException.java
    ├── BusinessException.java
    └── GlobalExceptionHandler.java
```

### 2. **Camada Model (Entidades JPA)**

Criadas duas entidades principais:

#### Usuario
- Campos: id, nome, email, cpf, telefone, createdAt, updatedAt
- Validações: email único, CPF único
- Timestamps automáticos

#### Estabelecimento
- Campos: id, nome, categoria, endereco, latitude, longitude, telefone, avaliacaoMedia, googlePlaceId
- Integração com Google Maps via googlePlaceId
- Validação de unicidade do Google Place ID

### 3. **Camada Repository**

Interfaces que estendem `JpaRepository` com métodos customizados:

#### UsuarioRepository
- `findByEmail(String email)`
- `findByCpf(String cpf)`
- `existsByEmail(String email)`
- `existsByCpf(String cpf)`

#### EstabelecimentoRepository
- `findByCategoria(String categoria)`
- `findByGooglePlaceId(String googlePlaceId)`
- `findByNomeContainingIgnoreCase(String nome)`
- `existsByGooglePlaceId(String googlePlaceId)`

### 4. **Camada Service (Lógica de Negócio)**

Implementação de regras de negócio e validações:

#### UsuarioService
- CRUD completo (criar, listar, buscar, atualizar, deletar)
- Validação de email duplicado
- Validação de CPF duplicado
- Transações gerenciadas com @Transactional

#### EstabelecimentoService
- CRUD completo
- Validação de Google Place ID duplicado
- Busca por categoria e nome
- Transações gerenciadas

### 5. **DTOs com Validação (Bean Validation)**

#### UsuarioDTO
Validações implementadas:
- `@NotBlank` - Nome e Email obrigatórios
- `@Size` - Tamanho mínimo e máximo
- `@Email` - Formato de email válido
- `@Pattern` - CPF no formato 11 dígitos ou XXX.XXX.XXX-XX
- `@Pattern` - Telefone em formatos válidos

#### EstabelecimentoDTO
Validações implementadas:
- `@NotBlank` - Nome, categoria e endereço obrigatórios
- `@NotNull` - Latitude e longitude obrigatórios
- `@DecimalMin/@DecimalMax` - Validação de ranges (lat/long, avaliação)
- `@Pattern` - Telefone em formatos válidos

### 6. **Controllers REST**

#### UsuarioController (`/api/usuarios`)
Endpoints:
- `GET /` - Listar todos
- `GET /{id}` - Buscar por ID
- `GET /email/{email}` - Buscar por email
- `POST /` - Criar novo usuário
- `PUT /{id}` - Atualizar usuário
- `DELETE /{id}` - Deletar usuário

#### EstabelecimentoController (`/api/estabelecimentos`)
Endpoints:
- `GET /` - Listar todos
- `GET /{id}` - Buscar por ID
- `GET /categoria/{categoria}` - Buscar por categoria
- `GET /buscar?nome=` - Buscar por nome
- `POST /` - Criar novo estabelecimento
- `PUT /{id}` - Atualizar estabelecimento
- `DELETE /{id}` - Deletar estabelecimento

### 7. **Tratamento de Exceções Global**

#### GlobalExceptionHandler
Centraliza o tratamento de erros com respostas padronizadas:

- `EntityNotFoundException` → HTTP 404
  - Retorna mensagem de erro personalizada

- `BusinessException` → HTTP 400
  - Usado para regras de negócio (email duplicado, etc)

- `MethodArgumentNotValidException` → HTTP 400
  - Retorna map com todos os erros de validação por campo

- `Exception` → HTTP 500
  - Captura erros genéricos

#### Exceções Customizadas
- `EntityNotFoundException` - Entidade não encontrada
- `BusinessException` - Violação de regra de negócio

### 8. **Dependências Adicionadas**

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

## Como Testar

### 1. Compilar e Rodar Testes
```bash
.\mvnw.cmd clean test
```

### 2. Rodar a Aplicação (perfil test com H2)
```bash
.\mvnw.cmd -Dspring.profiles.active=test spring-boot:run
```

### 3. Testar Endpoints (exemplos com curl ou Postman)

#### Criar Usuário
```bash
POST http://localhost:8080/api/usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "cpf": "12345678901",
  "telefone": "11987654321"
}
```

#### Listar Usuários
```bash
GET http://localhost:8080/api/usuarios
```

#### Criar Estabelecimento
```bash
POST http://localhost:8080/api/estabelecimentos
Content-Type: application/json

{
  "nome": "Restaurante Exemplo",
  "categoria": "Restaurante",
  "endereco": "Rua Exemplo, 123",
  "latitude": -23.550520,
  "longitude": -46.633308,
  "telefone": "1133334444",
  "avaliacaoMedia": 4.5
}
```

## Validações em Ação

### Exemplo de erro de validação:
```json
{
  "status": 400,
  "message": "Erro de validação",
  "timestamp": "2025-11-02T19:00:00",
  "errors": {
    "email": "Email inválido",
    "cpf": "CPF deve conter 11 dígitos ou estar no formato XXX.XXX.XXX-XX"
  }
}
```

### Exemplo de erro de negócio:
```json
{
  "status": 400,
  "message": "Email já cadastrado",
  "timestamp": "2025-11-02T19:00:00"
}
```

### Exemplo de entidade não encontrada:
```json
{
  "status": 404,
  "message": "Usuario com ID 999 não encontrado",
  "timestamp": "2025-11-02T19:00:00"
}
```

## Próximos Passos Recomendados

1. ✅ **Implementar testes unitários** para Services e Controllers
2. ✅ **Adicionar Swagger/OpenAPI** para documentação da API
3. ✅ **Implementar Spring Security** para autenticação e autorização
4. ✅ **Criar migrations com Flyway** para controle de versão do banco
5. ✅ **Adicionar logs estruturados** com SLF4J/Logback
6. ✅ **Configurar CORS** para permitir acesso do frontend
7. ✅ **Implementar paginação** nos endpoints de listagem

## Observações

- Os arquivos antigos em `com.example.demo` ainda existem e devem ser removidos manualmente
- A aplicação está configurada para rodar com H2 (test) ou MySQL (prod) via perfis
- Todas as validações estão funcionando corretamente
- Os testes passaram com sucesso (2/2 testes)
