# Frontend - Arquitetura JavaScript

Este diretório contém todo o código JavaScript da aplicação **BoraRoleta**, responsável pela interação com Google Maps API e manipulação da interface do usuário.

## Estrutura de Arquivos

```
static/js/
├── apiMaps.js           # Integração com Google Maps e Places API
├── main.js              # Carregamento dinâmico de templates HTML
├── buttons.js           # Gerenciamento de estados visuais dos botões
├── Admin/
│   └── admin.js         # Funcionalidades do painel administrativo
└── Clientes/
    ├── Cadastro.js      # Validação e envio de formulário de cadastro
    ├── Login.js         # Lógica de autenticação
    └── ValidaCadastro.js # Validações customizadas de campos
```

---

## apiMaps.js - Integração Google Maps

**Responsabilidade:** Gerenciar o mapa, geolocalização e busca de estabelecimentos por categoria.

### Funcionalidades principais:

#### 1. **Inicialização do Mapa**
```javascript
MapModule.init()
```
- Obtém localização do usuário via Geolocation API
- Fallback para São Paulo se geolocalização falhar ou for negada
- Cria instância do `google.maps.Map` com configurações customizadas
- Adiciona marcador azul indicando posição do usuário

#### 2. **Busca por Categoria**

| Função               | Tipo Places API  | Cor do Marcador | Raio de Busca |
|---------------------|------------------|-----------------|---------------|
| `buscarAdegas()`    | `liquor_store`   | Vermelho        | 2000m (2km)   |
| `buscarPagodes()`   | `bar` + keyword  | Verde           | 2000m         |
| `buscarBarzinhos()` | `bar`            | Azul            | 2000m         |
| `buscarEventos()`   | `night_club`     | Amarelo         | 2000m         |

**Fluxo de busca:**
1. Limpa marcadores de categorias anteriores (`limparTodasCategorias()`)
2. Faz requisição ao Places API com `nearbySearch()`
3. Cria marcadores coloridos para cada resultado
4. Ajusta zoom do mapa com `map.fitBounds()` para exibir todos
5. Renderiza cards de resultados no container `#resultados`

#### 3. **Limpeza de Dados**
```javascript
limparResultados()
```
- Remove todos os marcadores do mapa
- Limpa HTML do container `#resultados`
- Recentra mapa na localização do usuário
- Reseta zoom para 15

### Variáveis Globais

| Variável               | Tipo                   | Descrição                                |
|------------------------|------------------------|------------------------------------------|
| `map`                  | `google.maps.Map`      | Instância do mapa                        |
| `service`              | `PlacesService`        | Serviço de busca de lugares             |
| `userLocation`         | `LatLng`               | Coordenadas do usuário                   |
| `userMarker`           | `Marker`               | Marcador azul do usuário                 |
| `marcadoresAdegas`     | `Array<Marker>`        | Marcadores vermelhos (Adegas)            |
| `marcadoresPagodes`    | `Array<Marker>`        | Marcadores verdes (Pagodes)              |
| `marcadoresBarzinhos`  | `Array<Marker>`        | Marcadores azuis (Barzinhos)             |
| `marcadoresEventos`    | `Array<Marker>`        | Marcadores amarelos (Eventos)            |
| `mapaInicializado`     | `boolean`              | Flag de inicialização bem-sucedida       |

### Mecanismo de Inicialização

O mapa usa **polling** para garantir que DOM e Google Maps API estejam prontos:

```javascript
// Tenta inicializar imediatamente após script carregar
tentarInicializarMapa();

// Polling a cada 150ms por até 3 segundos
document.addEventListener("DOMContentLoaded", function () {
    const interval = setInterval(() => {
        tentarInicializarMapa();
        if (mapaInicializado || Date.now() - start > 3000) {
            clearInterval(interval);
        }
    }, 150);
});
```

**Motivo:** Evita erro "google is not defined" quando API demora para carregar.

---

## main.js - Carregamento de Templates

**Responsabilidade:** Carregar componentes HTML reutilizáveis dinamicamente.

### Templates carregados:

1. **Menu de navegação** (`/views/templates/menu.html`)
   - Injetado em `<div id="menu"></div>`
   
2. **Rodapé fixo** (`/views/templates/footer.html`)
   - Injetado em `<div id="footer"></div>`
   
3. **Conteúdo principal** (`/views/home.html`)
   - Inclui mapa e botões de categoria
   - Injetado em `<div id="home"></div>`

### Vantagens da abordagem:

- Evita duplicação de código HTML
- Facilita manutenção (alterar menu em um só lugar)
- Permite substituição dinâmica de conteúdo sem recarregar página  

**Exemplo de uso:**
```javascript
fetch("/views/templates/menu.html")
    .then(response => response.text())
    .then(data => document.getElementById("menu").innerHTML = data)
    .catch(error => console.error('Erro ao carregar menu:', error));
```

---

## buttons.js - Estados Visuais

**Responsabilidade:** Adicionar classe CSS `selecionado` aos botões clicados.

### Comportamento:

1. Seleciona todos os `<button>` da página
2. Adiciona listener de clique em cada um
3. Ao clicar:
   - Remove `selecionado` de todos os botões
   - Adiciona `selecionado` ao botão clicado

**CSS correspondente** (em `static/css/`):
```css
button.selecionado {
    background-color: #a991dc;
    color: white;
    border: 2px solid #F5E85D;
}
```

**Exemplo visual:**
- [Adegas] [Pagodes] [Barzinhos] [Eventos]
- Usuário clica "Pagodes" → fica destacado
- Outros botões voltam ao estado normal

---

## Admin/admin.js

**Responsabilidade:** Funcionalidades específicas do painel administrativo.

### Funcionalidades esperadas:
- Dashboard com estatísticas
- Gerenciamento de estabelecimentos
- Moderação de avaliações
- Visualização de usuários

*(Implementação em desenvolvimento)*

---

## Clientes/ - Autenticação e Cadastro

### `Cadastro.js`
**Responsabilidade:** Enviar dados de cadastro para backend via POST.

```javascript
function enviarCadastro() {
    const dados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        senha: document.getElementById("senha").value
    };
    
    fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = "/CadastroSucesso";
    })
    .catch(error => console.error("Erro:", error));
}
```

### `Login.js`
**Responsabilidade:** Autenticar usuário e armazenar token/sessão.

### `ValidaCadastro.js`
**Responsabilidade:** Validações front-end antes de enviar ao servidor.

- Email no formato correto
- Senha com mínimo de caracteres
- Confirmação de senha igual
- CPF válido (algoritmo de validação)

---

## Integração com Backend

### Endpoints REST consumidos:

| Endpoint                          | Método | Descrição                    |
|-----------------------------------|--------|------------------------------|
| `/api/usuarios`                   | POST   | Criar novo usuário           |
| `/api/usuarios/login`             | POST   | Autenticar usuário           |
| `/api/estabelecimentos`           | GET    | Listar estabelecimentos      |
| `/api/estabelecimentos/{id}`      | GET    | Detalhes de estabelecimento  |

### Tratamento de Erros

Sempre usar `try-catch` ou `.catch()` em fetch:

```javascript
fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error("Erro:", error);
        alert("Falha ao carregar dados. Tente novamente.");
    });
```

---

## Padrões e Convenções

### Nomenclatura
- **Variáveis:** camelCase (`userLocation`, `marcadoresAdegas`)
- **Funções:** camelCase (`buscarPagodes`, `limparResultados`)
- **Constantes:** UPPER_SNAKE_CASE (`API_KEY`, `MAX_RESULTS`)

### Modularização
- Use **IIFE** (Immediately Invoked Function Expression) para encapsular lógica:
  ```javascript
  const MapModule = (function() {
      // Código privado aqui
      return {
          init: init  // API pública
      };
  })();
  ```

### Documentação (JSDoc)
Sempre documente funções públicas:

```javascript
/**
 * Busca estabelecimentos do tipo "Adegas" próximos ao usuário.
 * @returns {void}
 */
function buscarAdegas() {
    // ...
}
```

---

## Testes

### Testes Manuais

1. **Geolocalização:**
   - Negar permissão → deve usar São Paulo como fallback
   - Aceitar permissão → marcador azul deve aparecer na posição correta

2. **Busca por Categoria:**
   - Clicar "Adegas" → marcadores vermelhos devem aparecer
   - Clicar "Pagodes" → marcadores anteriores devem sumir, novos verdes aparecem

3. **Limpar:**
   - Após busca, clicar "Limpar" → todos os marcadores somem, mapa recentra

### Teste de Integração

Verificar se API key está funcionando:
```javascript
console.log(window.google); // Deve retornar objeto
console.log(map); // Deve retornar instância do mapa
```

---

## Recursos Úteis

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API Reference](https://developers.google.com/maps/documentation/places/web-service/search)
- [Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [Geolocation API](https://developer.mozilla.org/pt-BR/docs/Web/API/Geolocation_API)

---

## Considerações de Segurança

### API Key
**NUNCA** exponha chaves de API diretamente no código JavaScript:

**Errado:**
```javascript
const API_KEY = "AIzaSyC..."; // Visível no código fonte
```

**Correto:**
```html
<!-- Carregada via Thymeleaf do backend -->
<script th:src="@{https://maps.googleapis.com/maps/api/js(key=${googleMapsApiKey})}"></script>
```

### Validação
Sempre validar no **backend** também. Validação front-end é apenas UX.

---

**Autor:** Equipe Bora Roleta - SENAC  
**Versão:** 2.0  
**Última atualização:** 2025
