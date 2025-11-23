/**
 * @fileoverview Script principal para carregamento dinâmico de componentes HTML.
 * Responsável por injetar menu, rodapé e conteúdo principal na página.
 * 
 * @author Equipe Bora Roleta - SENAC
 * @version 1.0
 */

/**
 * Carrega o componente de menu/navegação da aplicação.
 * Faz uma requisição para o template HTML e injeta no container 'menu'.
 * Após carregar, inicializa o sistema de autenticação.
 */
fetch("/views/templates/menu.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("menu").innerHTML = data;
        
        // Carregar e inicializar o sistema de autenticação
        const authScript = document.createElement('script');
        authScript.src = '/js/auth.js';
        authScript.onload = () => {
            // Inicializar Auth após o script ser carregado
            if (window.Auth) {
                window.Auth.init();
            }
        };
        document.head.appendChild(authScript);
    })
    .catch(error => console.error('Erro ao carregar menu:', error));

/**
 * Carrega o componente de rodapé fixo da aplicação.
 * Faz uma requisição para o template HTML e injeta no container 'footer'.
 */
fetch("/views/templates/footer.html")
    .then(response => response.text())
    .then(data => document.getElementById("footer").innerHTML = data)
    .catch(error => console.error('Erro ao carregar rodapé:', error));

/**
 * Carrega o conteúdo principal da página inicial (home).
 * Inclui o mapa interativo e os botões de filtro de categorias.
 */
fetch("/views/home.html")
    .then(response => response.text())
    .then(data => document.getElementById("home").innerHTML = data)
    .catch(error => console.error('Erro ao carregar conteúdo principal:', error));
