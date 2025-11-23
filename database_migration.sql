-- Script de migração para adicionar funcionalidade de autenticação
-- Sistema Bora Roleta
-- Data: 2025-11-23

-- 1. Adicionar coluna is_admin na tabela usuarios
ALTER TABLE usuarios 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. (Opcional) Criar índice para melhorar performance em consultas por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- 3. (Opcional) Criar alguns usuários de teste
-- Senha para todos: 123456 (criptografada com bcrypt)
-- Hash bcrypt de "123456": $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- Usuário comum de teste
INSERT INTO usuarios (nome, email, cpf, telefone, senha, is_admin, created_at, updated_at)
VALUES 
    ('João Silva', 'joao@teste.com', '12345678901', '11999999999', 
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
     FALSE, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Usuário administrador de teste
INSERT INTO usuarios (nome, email, cpf, telefone, senha, is_admin, created_at, updated_at)
VALUES 
    ('Maria Admin', 'maria.admin@teste.com', '98765432100', '11988888888', 
     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
     TRUE, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 4. Verificar os dados inseridos
SELECT id, nome, email, is_admin, created_at 
FROM usuarios 
ORDER BY created_at DESC 
LIMIT 5;

-- OBSERVAÇÕES:
-- - O login especial "admin/admin" não precisa estar no banco de dados
-- - Para criar novos usuários admin, você pode:
--   a) Inserir direto no banco com is_admin = TRUE
--   b) Atualizar um usuário existente: UPDATE usuarios SET is_admin = TRUE WHERE email = 'email@exemplo.com';
-- - A senha "123456" é apenas para testes. Em produção, use senhas fortes!
