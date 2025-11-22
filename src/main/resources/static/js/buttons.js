/**
 * @fileoverview Gerenciador de estados visuais dos botões de filtro.
 * Adiciona e remove a classe 'selecionado' dos botões quando clicados,
 * fornecendo feedback visual ao usuário sobre qual filtro está ativo.
 * 
 * @author Grupo 47 - SENAC
 * @version 1.0
 */

/**
 * Seleciona todos os botões da página e adiciona listeners de clique.
 * Quando um botão é clicado:
 * - Remove a classe 'selecionado' de todos os outros botões
 * - Adiciona a classe 'selecionado' apenas ao botão clicado
 * 
 * Isso proporciona feedback visual indicando qual categoria está ativa.
 */
const botoes = document.querySelectorAll("button");
botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        // Remove seleção de todos os botões
        botoes.forEach(b => b.classList.remove("selecionado"));

        // Adiciona a classe ao botão clicado
        botao.classList.add("selecionado");
    });
});
