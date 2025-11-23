/**
 * @fileoverview Sistema de autenticação e gerenciamento de sessão.
 * Responsável por login, logout e atualização dinâmica do menu de navegação.
 * Utiliza localStorage para persistência de sessão entre páginas.
 * 
 * @author Equipe Bora Roleta - SENAC
 * @version 1.0
 */

/**
 * Objeto responsável pelo gerenciamento de autenticação.
 * Provê métodos para login, logout, verificação de permissões e atualização do menu.
 * @namespace
 */
const Auth = {
    
    /**
     * Armazena os dados do usuário logado no localStorage
     */
    setUser: function(userData) {
        localStorage.setItem('boraRoleta_user', JSON.stringify(userData));
        this.updateMenu();
    },

    /**
     * Recupera os dados do usuário logado do localStorage
     */
    getUser: function() {
        const userData = localStorage.getItem('boraRoleta_user');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Remove os dados do usuário e faz logout
     */
    logout: function() {
        localStorage.removeItem('boraRoleta_user');
        this.updateMenu();
        window.location.href = '/';
    },

    /**
     * Verifica se há um usuário logado
     */
    isLoggedIn: function() {
        return this.getUser() !== null;
    },

    /**
     * Verifica se o usuário logado é administrador
     */
    isAdmin: function() {
        const user = this.getUser();
        return user && (user.isAdmin === true || user.admin === true);
    },

    /**
     * Atualiza o menu de navegação baseado no estado de autenticação
     */
    updateMenu: function() {
        const user = this.getUser();
        
        const linkAdmin = document.getElementById('link-admin');
        const linkLogin = document.getElementById('link-login');
        const userInfo = document.getElementById('user-info');
        const userGreeting = document.getElementById('user-greeting');
        const userAvatar = document.getElementById('user-avatar');
        const btnLogout = document.getElementById('btn-logout');

        if (user) {
            // Usuário está logado
            if (linkLogin) linkLogin.style.display = 'none';
            
            // Mostrar admin apenas se for administrador
            if (linkAdmin) {
                const isUserAdmin = user.isAdmin === true || user.admin === true;
                linkAdmin.style.display = isUserAdmin ? 'inline' : 'none';
            }
            
            // Mostrar informações do usuário
            if (userInfo) userInfo.style.display = 'flex';
            if (userGreeting) {
                userGreeting.textContent = `Olá, ${user.nome}!`;
            }
            
            // Definir avatar (pode usar uma imagem padrão)
            if (userAvatar) {
                // Usar emoji como avatar padrão ou URL de imagem se disponível
                userAvatar.src = user.avatarUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F5E85D"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6 0-8 3-8 6h16c0-3-2-6-8-6z"/></svg>';
                userAvatar.alt = `Foto de ${user.nome}`;
            }
            
            // Adicionar evento de logout
            if (btnLogout) {
                btnLogout.onclick = () => this.logout();
            }
        } else {
            // Usuário não está logado
            if (linkLogin) linkLogin.style.display = 'inline';
            if (linkAdmin) linkAdmin.style.display = 'none';
            if (userInfo) userInfo.style.display = 'none';
        }
    },

    /**
     * Inicializa o sistema de autenticação
     * Deve ser chamado quando o menu é carregado
     */
    init: function() {
        // Atualizar menu com base no estado atual
        this.updateMenu();
    }
};

// Tornar o objeto Auth disponível globalmente
window.Auth = Auth;
