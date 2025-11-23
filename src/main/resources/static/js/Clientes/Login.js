/**
 * @fileoverview Script de controle de login e autenticação de usuários.
 * Gerencia a visualização de senha, validação de formulário e comunicação com API.
 * Suporta login especial de administrador (admin/admin) e usuários do banco de dados.
 * 
 * @author Equipe Bora Roleta - SENAC
 * @version 1.0
 */

// Toggle de visualização de senha
const senha = document.getElementById('senha');
const toggleBtn = document.getElementById('toggleSenha');
const iconSenha = document.getElementById('iconSenha');

// SVG para senha visível (olho aberto)
const eyeOpenSVG = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';

// SVG para senha oculta (olho fechado com linha)
const eyeClosedSVG = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

toggleBtn.addEventListener('click', function () {
    const tipoAtual = senha.getAttribute("type");
    toggleBtn.style.opacity = "0";

    setTimeout(() => {
        if (tipoAtual === "password") {
            senha.setAttribute("type", "text");
            iconSenha.innerHTML = eyeOpenSVG;
            toggleBtn.setAttribute("title", "Ocultar senha");
        } else {
            senha.setAttribute("type", "password");
            iconSenha.innerHTML = eyeClosedSVG;
            toggleBtn.setAttribute("title", "Mostrar senha");
        }
        toggleBtn.style.opacity = "1";
    }, 150);
});

// Processamento do formulário de login
const loginForm = document.getElementById('loginForm');
const mensagemErro = document.getElementById('mensagem-erro');

loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senhaValue = document.getElementById('senha').value;

    // Validações básicas
    if (!email || !senhaValue) {
        mostrarErro('Por favor, preencha todos os campos.');
        return;
    }

    // Desabilitar botão durante o processamento
    const btnEntrar = loginForm.querySelector('.login');
    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando...';

    try {
        // Fazer requisição de login
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senhaValue
            })
        });

        if (response.ok) {
            const userData = await response.json();
            
            // Armazenar dados do usuário usando o módulo Auth
            if (window.Auth) {
                window.Auth.setUser(userData);
            } else {
                // Fallback se Auth não estiver carregado
                localStorage.setItem('boraRoleta_user', JSON.stringify(userData));
            }
            
            // Redirecionar para a página inicial
            window.location.href = '/';
        } else {
            // Tratar erros de autenticação
            const error = await response.json();
            mostrarErro(error.message || 'Email ou senha inválidos.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        mostrarErro('Erro ao conectar com o servidor. Tente novamente.');
    } finally {
        // Reabilitar botão
        btnEntrar.disabled = false;
        btnEntrar.textContent = 'Entrar';
    }
});

/**
 * Exibe mensagem de erro na tela
 */
function mostrarErro(mensagem) {
    mensagemErro.textContent = mensagem;
    mensagemErro.style.display = 'block';
    
    // Ocultar mensagem após 5 segundos
    setTimeout(() => {
        mensagemErro.style.display = 'none';
    }, 5000);
}
