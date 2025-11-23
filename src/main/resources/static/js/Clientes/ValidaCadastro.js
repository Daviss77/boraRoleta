/**
 * @fileoverview Validação de formulário de cadastro.
 * 
 * Valida campos do formulário (nome, telefone, email, CPF, senha) com regex patterns
 * e exibe mensagens de erro antes do envio.
 * 
 * @author Equipe Bora Roleta - SENAC 2025
 * @version 1.0
 */

document.getElementById("formCadastro").addEventListener("submit", function (event){
    const nome = document.getElementById("name").value.trim();
    const telefone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const senha = document.getElementById("password").value.trim();
    const confirmaSenha = document.getElementById("confirma").value.trim();

    let erros = [];

    if (nome < 8) {
        erros.push("O nome deve ter no mínimo 10 letras");
    }

    const regexTelefone = /^\d{11}$/;
    if (!regexTelefone.test(telefone)){
        erros.push("O telefone deve conter 11 digítos")
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)){
        erros.push("A algo de errado na estrutura do seu e-mail");
    }

    const regexCpf = /^\d{11}$/;
    if (!regexCpf.test(cpf)){
        erros.push("O CPF deve conter 11 digítos");
    }

    const contemNumero = /\d/;
    const contemEspecial = /[^a-zA-Z0-9]/;
    if (senha.length < 8){
        erros.push("A senha deve conter 6 caracteres");
    }

    if(!contemNumero.test(senha)){
        erros.push("A senha deve conter pelo menos um número");
    }
    if (!contemEspecial.test(senha)){
        erros.push("A senha deve conter pelo menos um caractere especial");
    }

    if (senha !== confirmaSenha){
        erros.push("As senhas não se correspondem")
    }

    if (erros.length > 0){
        event.preventDefault();
        alert(erros.join("\n"));
    }
});
