/**
 * @fileoverview Script de cadastro de novos usuários.
 * 
 * Gerencia o formulário de cadastro, validação de campos e comunicação com a API.
 * Implementa máscaras automáticas para telefone e CPF.
 * 
 * @author Equipe Bora Roleta - SENAC 2025
 * @version 1.2
 */

/**
 * Aplica máscara de telefone (XX) XXXXX-XXXX
 * @param {string} value - Valor do campo de telefone
 * @returns {string} Valor formatado
 */
function mascaraTelefone(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
}

/**
 * Aplica máscara de CPF 000.000.000-00
 * @param {string} value - Valor do campo de CPF
 * @returns {string} Valor formatado
 */
function mascaraCPF(value) {
    value = value.replace(/\D/g, "");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return value;
}

// Adiciona eventos de input para aplicar máscaras em tempo real
document.getElementById("telefone").addEventListener("input", function(e) {
    e.target.value = mascaraTelefone(e.target.value);
    e.target.maxLength = 15;
});

document.getElementById("cpf").addEventListener("input", function(e) {
    e.target.value = mascaraCPF(e.target.value);
    e.target.maxLength = 14;
});

document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Remove máscaras antes de enviar ao servidor
    const telefoneRaw = document.getElementById("telefone").value.replace(/\D/g, "");
    const cpfRaw = document.getElementById("cpf").value.replace(/\D/g, "");

    const data = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        telefone: telefoneRaw,
        cpf: cpfRaw,
        senha: document.getElementById("senha").value
    };

    const btnCadastrar = document.getElementById("botao");
    btnCadastrar.disabled = true;
    btnCadastrar.textContent = "Cadastrando...";

    try {
        const response = await fetch("/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Usuário cadastrado com sucesso!");
            window.location.href = "/views/Login/login.html";
        } else {
            const error = await response.json();
            alert(error.message || "Erro ao cadastrar usuário.");
        }
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
        btnCadastrar.disabled = false;
        btnCadastrar.textContent = "Cadastrar?";
    }
});
