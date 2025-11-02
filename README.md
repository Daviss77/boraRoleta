# BoraRoleta

Sistema web para descoberta de estabelecimentos usando Google Maps API.

[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.7-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Funcionalidades

- Cadastro e gerenciamento de usuarios
- Cadastro e busca de estabelecimentos
- Integracao com Google Maps API
- Busca por categoria e proximidade
- Sistema de avaliacoes
- Sugestoes aleatorias de locais
- API REST com validacoes
- Tratamento centralizado de erros

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

- Java 17 instalado e configurado no PATH
- MySQL 8 ou acesso a uma instancia compativel
- Conta na Google Cloud com chave da Google Maps API
- Git para controle de versao

## Configuracao de ambiente

1. Copie o arquivo `.env.example` para `.env`.
2. Informe as variaveis de banco (`DB_USERNAME`, `DB_PASSWORD`, `DB_URL` quando necessario) e a `GOOGLE_MAPS_API_KEY`.
3. Carregue as variaveis antes de executar o projeto:
   - Windows PowerShell: `./setenv.ps1`
   - Windows CMD: `setenv.bat`
4. Verifique se o banco `boraroleta` existe e se as credenciais possuem privilegios de leitura e escrita.

## Perfis ativos

- `dev`: usa banco local e recursos de desenvolvimento.
- `test`: utiliza H2 em memoria para testes automatizados.
- `prod`: conecta ao banco MySQL configurado e exige variaveis externas.

Defina o perfil com a variavel de ambiente `SPRING_PROFILES_ACTIVE`.

## Executando o projeto

### Ambiente de desenvolvimento
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev
```

### Ambiente de producao
```powershell
$env:SPRING_PROFILES_ACTIVE = "prod"
.\mvnw.cmd spring-boot:run
```

Para produzir um pacote executavel:
```powershell
.\mvnw.cmd clean package
```
O arquivo final sera gerado em `target/`.

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
        controller/
        service/
        repository/
        model/
        dto/
        exception/
        config/
        BoraRoletaApplication.java
      resources/
        static/
          css/
          js/
        templates/
        application.properties
        application-prod.properties
        application-test.properties
    test/
      java/br/edu/senac/boraroleta/
  .env.example
  pom.xml
  README.md
  setenv.bat
  setenv.ps1
```

## Contribuicao

1. Faca um fork do repositorio.
2. Crie uma branch (`git checkout -b feature/nome-da-feature`).
3. Faca commits objetivos (`git commit -m "Adiciona nova funcionalidade"`).
4. Envie a branch (`git push origin feature/nome-da-feature`).
5. Abra um Pull Request descrevendo as alteracoes.

## Licenca

Este projeto esta licenciado sob a licenca MIT. Consulte o arquivo [LICENSE](LICENSE) para detalhes.

## Autoria

Equipe BoraRoleta - Trabalho academico SENAC.

## Agradecimentos

- Professores e orientadores do SENAC
- Comunidade Spring Boot
- Google Maps Platform
- Contribuidores do projeto
