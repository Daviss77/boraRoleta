// Integração real com a API de usuários do backend

let usuarios = [];

async function carregarUsuarios() {
    const resp = await fetch('/api/usuarios');
    if (!resp.ok) {
        console.error('Falha ao carregar usuários');
        return;
    }
    usuarios = await resp.json();
    renderUsuarios(usuarios);
}

function renderUsuarios(lista) {
    const container = document.getElementById('usuarios-container');
    container.innerHTML = '';

    if (!lista || lista.length === 0) {
        container.innerHTML = '<div class="usuarios">Nenhum usuário encontrado.</div>';
        return;
    }

    // Cabeçalho (uma única vez)
    const head = document.createElement('div');
    head.className = 'usuarios-head';
    head.innerHTML = `
        <span>Nome</span>
        <span>Email</span>
        <span>CPF</span>
        <span>Data de Criação</span>
        <span></span>
    `;
    container.appendChild(head);

    // Linhas
    lista.forEach((u) => {
        const row = document.createElement('div');
        row.className = 'usuarios-row';
        const dataCriacao = u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '-';
        row.innerHTML = `
            <span>${u.nome ?? ''}</span>
            <span>${u.email ?? ''}</span>
            <span>${u.cpf ?? ''}</span>
            <span>${dataCriacao}</span>
            <div class="acoes">
                <button class="delete" data-id="${u.id}">Del</button>
            </div>
        `;
        container.appendChild(row);
    });

    container.querySelectorAll('button.delete').forEach(btn => {
        btn.addEventListener('click', async (ev) => {
            const id = ev.currentTarget.getAttribute('data-id');
            const confirmacao = confirm('Deseja remover o usuário selecionado?');
            if (!confirmacao) return;
            const resp = await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
            if (resp.ok) {
                await carregarUsuarios();
            } else {
                alert('Falha ao deletar o usuário.');
            }
        });
    });
}

async function buscarUsuarios() {
    const q = document.getElementById('busca').value.trim();
    if (!q) {
        renderUsuarios(usuarios);
        return;
    }
    const url = `/api/usuarios/search?q=${encodeURIComponent(q)}`;
    const resp = await fetch(url);
    if (resp.ok) {
        const data = await resp.json();
        renderUsuarios(data);
    } else {
        alert('Erro ao buscar usuários');
    }
}

function adicionarUsuario() {
    // Placeholder simples; cadastro real deveria postar para /api/usuarios
    alert('Cadastro de usuário via UI não implementado ainda.');
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inserir-usuario').addEventListener('click', adicionarUsuario);
    document.getElementById('btn-buscar').addEventListener('click', buscarUsuarios);
    document.getElementById('btn-recarregar').addEventListener('click', carregarUsuarios);
    carregarUsuarios();
});
