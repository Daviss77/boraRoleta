# BoraRoleta

Sistema web para descoberta de estabelecimentos usando Google Maps API.

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Funcionalidades

- **Sistema de Autenticação** - Login de usuários e administrador com BCrypt
- **Cadastro de usuários** - Com validação e máscaras para telefone e CPF
- **Gerenciamento de estabelecimentos** - CRUD completo
- **Integração com Google Maps API e Places API**
- **Busca por categoria** - Adegas, Pagodes, Barzinhos, Eventos (raio de 2km)
- **Geolocalização automática** - Com fallback para São Paulo
- **Marcadores coloridos por categoria** - Vermelho, verde, azul, amarelo
- **Auto-zoom do mapa** - Exibe todos os resultados automaticamente
- **Menu dinâmico** - Adapta-se ao estado de autenticação
- **Placeholder de carregamento** - Feedback visual enquanto mapa carrega
- **Sistema de planos** - Três tiers de assinatura
- **API REST com validações**
- **Tratamento centralizado de erros**

## Arquitetura em camadas

A aplicacao segue arquitetura em camadas para manter responsabilidades separadas e facilitar manutencao.

```text
br.edu.senac.boraroleta/
  controller/        # Endpoints REST e paginas web
  service/           # Regra de negocio
  repository/        # Acesso a dados com Spring Data JPA
  model/             # Entidades JPA
  dto/               # Objetos de transferencia de dados
  exception/         # Excecoes e handlers
  config/            # Configuracoes adicionais
```

## Tecnologias utilizadas

### Backend
- Java 17
- Spring Boot 3.5.7
- Spring Data JPA
- Spring Web
- Spring Validation
- Hibernate ORM
- Spring Boot DevTools (ambiente local)

### Banco de dados
- MySQL 8+ (desenvolvimento e producao)
- H2 em memoria (perfil de testes)

### Ferramentas de suporte
- Maven Wrapper (`mvnw.cmd`)
- Lombok
- MapStruct
- Docker (opcional para provisionar dependencias)
- VS Code ou IntelliJ IDEA (suporte recomendado)

## Requisitos

### Obrigatórios
- **Java 17** ou superior instalado e configurado no PATH
- **MySQL 8+** ou acesso a uma instância compatível
- **Google Maps API Key** com os seguintes serviços habilitados:
  - Maps JavaScript API
  - Places API
  - **Billing habilitado** na Google Cloud Console (obrigatório mesmo para uso gratuito)
- **Git** para controle de versão

### Recomendados
- Maven 3.8+ (ou usar o wrapper `mvnw.cmd` incluído)
- VS Code com extensão Java ou IntelliJ IDEA
- Postman ou similar para testar endpoints REST

## Configuração de ambiente

### 1. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo `.env` com o seguinte conteúdo:

```env
# Banco de dados MySQL
DB_USERNAME=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_URL=jdbc:mysql://localhost:3306/boraroleta

# Google Maps API
GOOGLE_MAPS_API_KEY=sua_chave_api_aqui
```

**IMPORTANTE:** O arquivo `.env` já está no `.gitignore` para evitar exposição de credenciais.

### 2. Configurar banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE boraroleta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Adicionar coluna is_admin (executar após primeira inicialização)
ALTER TABLE usuarios ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Criar índice para performance em autenticação
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
```

As tabelas serão criadas automaticamente pelo Hibernate na primeira execução.

### 3. Obter Google Maps API Key

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative as APIs necessárias:
   - Maps JavaScript API
   - Places API
4. Vá em "Credenciais" → "Criar credenciais" → "Chave de API"
5. (Opcional) Restrinja a chave por domínio ou IP para segurança

### 4. Executar script de ambiente

**Windows PowerShell:**
```powershell
.\run.ps1
```

Este script:
- Lê o arquivo `.env` e carrega as variáveis de ambiente
- Inicia a aplicação Spring Boot automaticamente

**Alternativa manual (CMD):**
```cmd
setenv.bat
mvnw.cmd spring-boot:run
```

## Sistema de Autenticação

### Login de Administrador (Hard-coded)
```
Usuário: admin
Senha: admin
```

O login de administrador é verificado diretamente no código, sem necessidade de cadastro no banco. Quando logado como admin, o menu exibe a opção "ADMIN".

### Login de Usuários
Usuários cadastrados no banco de dados podem fazer login com e-mail e senha. As senhas são criptografadas usando BCrypt (força 10).

### Cadastro de Usuários
O formulário de cadastro (`/views/Cadastro/cadastro.html`) inclui:
- **Máscaras automáticas** para telefone `(XX) XXXXX-XXXX` e CPF `000.000.000-00`
- **Validação em tempo real** dos campos
- **Remoção das máscaras** antes do envio ao servidor

### Menu Dinâmico
O menu se adapta automaticamente ao estado de autenticação:
- **Deslogado:** HOME | PLANOS | LOGIN
- **Usuário comum:** HOME | PLANOS | Olá, [Nome]! [Sair]
- **Administrador:** HOME | PLANOS | ADMIN | Olá, ADMIN! [Sair]

### Arquitetura de Autenticação

**Backend (Java/Spring Boot):**
- `AuthController` - Endpoint `/api/auth/login`
- `UsuarioService.autenticar()` - Valida credenciais e retorna `LoginResponseDTO`
- Senhas criptografadas com BCrypt

**Frontend (JavaScript):**
- `auth.js` - Módulo global de autenticação com localStorage
- `Login.js` - Gerencia formulário de login
- `Cadastro.js` - Gerencia formulário de cadastro com máscaras
- Persistência de sessão entre páginas

## Perfis ativos

- `dev`: usa banco local e recursos de desenvolvimento.
- `test`: utiliza H2 em memoria para testes automatizados.
- `prod`: conecta ao banco MySQL configurado e exige variaveis externas.

Defina o perfil com a variavel de ambiente `SPRING_PROFILES_ACTIVE`.

## Executando o projeto

### Forma recomendada (Windows PowerShell)

```powershell
.\run.ps1
```

A aplicação estará disponível em: **http://localhost:8080**

### Ambiente de desenvolvimento (manual)

```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Ambiente de produção

```powershell
$env:SPRING_PROFILES_ACTIVE = "prod"
.\mvnw.cmd spring-boot:run
```

### Gerar pacote executável

Para produzir um JAR executável:

```powershell
.\mvnw.cmd clean package -DskipTests
```

O arquivo será gerado em `target/boraroleta-0.0.1-SNAPSHOT.jar`

Para executá-lo:

```powershell
java -jar target/boraroleta-0.0.1-SNAPSHOT.jar
```

## Troubleshooting (Solução de problemas)

### Erro: "This page didn't load Google Maps correctly"

**Causa:** API Key inválida ou restrições de domínio/IP configuradas incorretamente.

**Solução:**
1. Verifique se a chave API está correta no arquivo `.env`
2. Confirme que Maps JavaScript API e Places API estão ativas no projeto
3. Revise as restrições de chave (domínio/IP) no Google Cloud Console

### Erro: "Mapa ainda está carregando sua localização"

**Causa:** Navegador bloqueou permissão de geolocalização.

**Solução:**
1. Clique no ícone de cadeado na barra de endereços
2. Permita acesso à localização
3. Recarregue a página (F5)

Se o problema persistir, o sistema usará São Paulo como localização padrão automaticamente.

### Erro: Variáveis do `.env` não são carregadas

**Causa:** Script `run.ps1` não foi executado ou arquivo `.env` não existe.

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz do projeto
2. Execute `.\run.ps1` ao invés de `mvnw.cmd spring-boot:run` diretamente
3. Confirme que as variáveis foram carregadas: `Get-ChildItem Env:GOOGLE_MAPS_API_KEY`

### Erro: Conexão recusada ao MySQL

**Causa:** MySQL não está rodando ou credenciais incorretas.

**Solução:**
1. Verifique se o MySQL está ativo: `Get-Service MySQL*`
2. Teste conexão: `mysql -u seu_usuario -p`
3. Confirme que o banco `boraroleta` existe
4. Verifique credenciais no arquivo `.env`

### Erro: Marcadores não aparecem no mapa

**Causa:** A categoria selecionada não retornou resultados no raio de 2km.

**Solução:**
- Tente aumentar o raio de busca editando `apiMaps.js` (linha com `radius: 2000`)
- Experimente outras categorias disponíveis
- Verifique se está em uma área urbana com estabelecimentos cadastrados no Google

## Testes

Execute toda a suite de testes:
```powershell
.\mvnw.cmd test
```

Gerar relatorio de cobertura (se configurado no `pom.xml`):
```powershell
.\mvnw.cmd test jacoco:report
```

## Estrutura do projeto

```text
boraRoleta/
  src/
    main/
      java/br/edu/senac/boraroleta/
        controller/        # Endpoints REST e páginas
          AuthController.java
          UsuarioController.java
          EstabelecimentoController.java
          HomeController.java
        service/           # Lógica de negócio
          UsuarioService.java
          EstabelecimentoService.java
        repository/        # Acesso a dados
          UsuarioRepository.java
          EstabelecimentoRepository.java
        model/             # Entidades JPA
          Usuario.java
          Estabelecimento.java
        dto/               # Data Transfer Objects
          LoginDTO.java
          LoginResponseDTO.java
          UsuarioDTO.java
          EstabelecimentoDTO.java
        exception/         # Tratamento de erros
          GlobalExceptionHandler.java
          EntityNotFoundException.java
          BusinessException.java
        config/            # Configurações
          DataSourceConfig.java
        BoraRoletaApplication.java
      resources/
        static/
          css/             # Estilos
            body.css
            pagina-planos.css
            templateCSS/
              menu.css
            Clientes/
              login.css
          js/              # Scripts
            auth.js        # Sistema de autenticação
            main.js        # Carregamento de componentes
            apiMaps.js     # Integração Google Maps
            buttons.js     # Gerenciamento de filtros
            Clientes/
              Login.js     # Formulário de login
              Cadastro.js  # Formulário de cadastro com máscaras
          views/           # Páginas HTML
            home.html
            Login/
              login.html
            Cadastro/
              cadastro.html
            templates/
              menu.html    # Menu dinâmico
              footer.html
        templates/         # Templates Thymeleaf
          index.html
          planos.html
        application.properties
        application-prod.properties
        application-test.properties
    test/
      java/br/edu/senac/boraroleta/
  database_migration.sql   # Scripts SQL
  .env                     # Variáveis de ambiente (não versionado)
  .env.example             # Template de configuração
  pom.xml
  README.md
  run.ps1                  # Script de execução Windows
  setenv.bat
  setenv.ps1
```

## Documentação Adicional

- [database_migration.sql](database_migration.sql) - Scripts de migração do banco de dados
- [src/main/resources/static/js/README.md](src/main/resources/static/js/README.md) - Documentação dos scripts JavaScript

## Contribuicao

1. Faca um fork do repositorio.
2. Crie uma branch (`git checkout -b feature/nome-da-feature`).
3. Faca commits objetivos (`git commit -m "Adiciona nova funcionalidade"`).
4. Envie a branch (`git push origin feature/nome-da-feature`).
5. Abra um Pull Request descrevendo as alteracoes.

## Licenca

Este projeto esta licenciado sob a licenca MIT. Consulte o arquivo [LICENSE](LICENSE) para detalhes.

## Autoria

Equipe Bora Roleta - Trabalho acadêmico SENAC 2025.

## Changelog

### v1.1 - 2025-11-23
- Sistema completo de autenticação implementado
- Login de administrador (admin/admin) e usuários do banco
- Menu dinâmico baseado em permissões
- Página de login com toggle de senha
- Máscaras automáticas para telefone e CPF no cadastro
- Placeholder de carregamento no mapa
- Migração para campo is_admin no banco
- Senhas criptografadas com BCrypt

### v1.0 - 2025
- Versão inicial com integração Google Maps
- CRUD de usuários e estabelecimentos
- Busca por categorias com marcadores coloridos
- Sistema de planos

## Agradecimentos

- Professores e orientadores do SENAC
- Comunidade Spring Boot
- Google Maps Platform
- Contribuidores do projeto
