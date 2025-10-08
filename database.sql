-- Banco e charset
CREATE DATABASE   HugDown_rede_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE HugDown_rede_social;

-- TABELA PRINCIPAL: usuarios (com colunas adicionadas diretamente)
-- ======================================================
CREATE TABLE      usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome_real VARCHAR(100) NOT NULL,
    sobrenome_real VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    cep VARCHAR(20) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Brasil',
    verificado BOOLEAN DEFAULT FALSE,
    foto_perfil VARCHAR(500),
    biografia TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    idioma_preferido VARCHAR(10) DEFAULT 'en-US',
    genero VARCHAR(20),
    data_nascimento DATE,
    fuso_horario VARCHAR(50),
    provider_oauth VARCHAR(50),
    id_oauth VARCHAR(100),
    subscription TEXT NULL,
    bloqueado BOOLEAN DEFAULT FALSE,
    motivo_bloqueio TEXT,
    data_bloqueio TIMESTAMP NULL,
    motivo_desbloqueio TEXT,
    data_desbloqueio TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_nome_usuario (nome_usuario),
    INDEX idx_verificado (verificado),
    INDEX idx_ativo (ativo)
);

-- ======================================================
-- TABELA: administradores (depende de usuarios)
-- ======================================================
CREATE TABLE      administradores (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel_admin ENUM('super_admin', 'moderator', 'verifier') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_nivel (nivel_admin)
);

-- ======================================================
-- TABELAS DE CATEGORIAS / TAGS / IDIOMAS
-- ======================================================
CREATE TABLE      categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor_categoria VARCHAR(7) DEFAULT '#007bff',
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_ativo (ativo)
);

CREATE TABLE      idiomas (
    codigo_idioma VARCHAR(10) PRIMARY KEY, -- ex: 'pt-BR', 'en-US'
    nome_idioma VARCHAR(100) NOT NULL
);

CREATE TABLE      tags (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    nome_tag VARCHAR(100) UNIQUE NOT NULL,
    descricao_tag TEXT,
    uso_contador INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome_tag (nome_tag),
    INDEX idx_uso_contador (uso_contador)
);

-- ======================================================
-- TABELAS DE CONTEÚDO: postagens, secoes, grupos
-- ======================================================
CREATE TABLE      grupos (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_administrador INT NOT NULL,
    nome_grupo VARCHAR(100) NOT NULL,
    descricao_grupo TEXT,
    foto_grupo VARCHAR(500),
    tipo_privacidade ENUM('public', 'private', 'secret') DEFAULT 'public',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_administrador (id_administrador),
    INDEX idx_tipo_privacidade (tipo_privacidade),
    INDEX idx_ativo (ativo)
);

CREATE TABLE      secoes (
    id_secao INT AUTO_INCREMENT PRIMARY KEY,
    nome_secao VARCHAR(100) NOT NULL,
    descricao_secao TEXT,
    icone_secao VARCHAR(50),
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    id_grupo INT NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    INDEX idx_ordem (ordem_exibicao),
    INDEX idx_ativo (ativo)
);

CREATE TABLE      postagens (
    id_postagem INT AUTO_INCREMENT PRIMARY KEY,
    id_autor INT NOT NULL,
    id_categoria INT,
    -- observação: deixei id_tag na modelagem original, mas o relacionamento correto é via postagens_tags (muitos-para-muitos).
    tipo_postagem ENUM('text', 'photo', 'video', 'article') NOT NULL,
    conteudo TEXT,
    url_midia VARCHAR(500),
    tipo_midia VARCHAR(50),
    titulo VARCHAR(200),
    resumo TEXT,
    artigo_cientifico BOOLEAN DEFAULT FALSE,
    visualizacoes INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    privacidade ENUM('public', 'friends', 'private') DEFAULT 'public',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    INDEX idx_autor (id_autor),
    INDEX idx_categoria (id_categoria),
    INDEX idx_tipo (tipo_postagem),
    INDEX idx_artigo_cientifico (artigo_cientifico),
    INDEX idx_data_criacao (data_criacao),
    INDEX idx_ativo (ativo)
);

-- Relacionamento N:N entre postagens e tags
CREATE TABLE      postagens_tags (
    id_postagem INT NOT NULL,
    id_tag INT NOT NULL,
    PRIMARY KEY (id_postagem, id_tag),
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_tag) REFERENCES tags(id_tag) ON DELETE CASCADE
);

-- Relacionamento postagens <-> secoes (N:N)
CREATE TABLE      postagens_secoes (
    id_postagem INT NOT NULL,
    id_secao INT NOT NULL,
    PRIMARY KEY (id_postagem, id_secao),
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_secao) REFERENCES secoes(id_secao) ON DELETE CASCADE
);

-- ======================================================
-- INTERAÇÕES: comentarios, curtidas, compartilhamentos
-- ======================================================
CREATE TABLE      comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_postagem INT NOT NULL,
    id_autor INT NOT NULL,
    conteudo TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_postagem (id_postagem),
    INDEX idx_autor (id_autor),
    INDEX idx_data_criacao (data_criacao)
);

CREATE TABLE      curtidas (
    id_curtida INT AUTO_INCREMENT PRIMARY KEY,
    id_postagem INT NOT NULL,
    id_usuario INT NOT NULL,
    data_curtida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_curtida (id_postagem, id_usuario),
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_postagem (id_postagem),
    INDEX idx_usuario (id_usuario)
);

CREATE TABLE      compartilhamentos (
    id_compartilhamento INT AUTO_INCREMENT PRIMARY KEY,
    id_postagem INT NOT NULL,
    id_usuario INT NOT NULL,
    mensagem_compartilhamento TEXT,
    data_compartilhamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_postagem (id_postagem),
    INDEX idx_usuario (id_usuario),
    INDEX idx_data (data_compartilhamento)
);

-- ======================================================
-- AMIZADES, MENSAGENS DIRETAS, TEMAS
-- ======================================================
CREATE TABLE      amizades (
    id_amizade INT AUTO_INCREMENT PRIMARY KEY,
    id_solicitante INT NOT NULL,
    id_destinatario INT NOT NULL,
    status_amizade ENUM('pending', 'accepted', 'rejected', 'blocked') DEFAULT 'pending',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_friendship (id_solicitante, id_destinatario),
    FOREIGN KEY (id_solicitante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_solicitante (id_solicitante),
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_status (status_amizade)
);

CREATE TABLE      mensagens_diretas (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    conteudo TEXT,
    url_midia VARCHAR(500),
    tipo_midia VARCHAR(50),
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    emoji VARCHAR(10),
    FOREIGN KEY (id_remetente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_remetente (id_remetente),
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_lida (lida),
    INDEX idx_data_envio (data_envio)
);

CREATE TABLE      temas_conversa (
    id_tema INT AUTO_INCREMENT PRIMARY KEY,
    nome_tema VARCHAR(50) NOT NULL,
    cor_tema VARCHAR(7) DEFAULT '#007bff',
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE      conversa_tema (
    id_conversa INT NOT NULL,
    id_tema INT NOT NULL,
    PRIMARY KEY (id_conversa, id_tema),
    FOREIGN KEY (id_conversa) REFERENCES mensagens_diretas(id_mensagem) ON DELETE CASCADE,
    FOREIGN KEY (id_tema) REFERENCES temas_conversa(id_tema) ON DELETE CASCADE
);

-- ======================================================
-- EVENTOS E PARTICIPANTES
-- ======================================================
CREATE TABLE      eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    nome_categoria_evento VARCHAR(100),
    titulo_evento VARCHAR(200) NOT NULL,
    descricao_evento TEXT,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME,
    local_evento VARCHAR(500),
    endereco_evento TEXT,
    tipo_evento ENUM('in_person', 'online', 'hybrid') DEFAULT 'in_person',
    evento_online BOOLEAN DEFAULT FALSE,
    link_online VARCHAR(500),
    max_participantes INT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    FOREIGN KEY (id_organizador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_organizador (id_organizador),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_ativo (ativo)
);

CREATE TABLE      participantes_evento (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_usuario INT NOT NULL,
    status_participacao ENUM('confirmed', 'maybe', 'not_going', 'canceled') DEFAULT 'confirmed',
    data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_participation (id_evento, id_usuario),
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_evento (id_evento),
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status_participacao)
);

-- ======================================================
-- MEMBROS DE GRUPO
-- ======================================================
CREATE TABLE      membros_grupo (
    id_membro INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,
    papel_membro ENUM('admin', 'moderator', 'member') DEFAULT 'member',
    data_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_membership (id_grupo, id_usuario),
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_grupo (id_grupo),
    INDEX idx_usuario (id_usuario),
    INDEX idx_papel (papel_membro)
);

-- ======================================================
-- PROFISSIONAIS DE SAUDE E DOCUMENTOS DE VERIFICACAO
-- (administradores já criados antes, porque profissionais referenciam administradores)
-- ======================================================
CREATE TABLE      profissionais_saude (
    id_profissional INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_registro ENUM('CRM', 'COREN', 'CRF', 'CREFITO', 'CRP', 'OUTRO') NOT NULL,
    numero_registro VARCHAR(50) NOT NULL,
    uf_registro VARCHAR(2) NOT NULL,
    especialidade VARCHAR(100),
    instituicao VARCHAR(200),
    data_registro DATE NOT NULL,
    status_verificacao ENUM('pendente', 'aprovado', 'rejeitado') DEFAULT 'pendente',
    data_solicitacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_verificacao TIMESTAMP NULL,
    verificado_por INT NULL,
    observacoes TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (verificado_por) REFERENCES administradores(id_admin),
    UNIQUE KEY unique_registro (tipo_registro, numero_registro, uf_registro),
    INDEX idx_status (status_verificacao),
    INDEX idx_tipo_registro (tipo_registro)
);

CREATE TABLE      documentos_verificacao (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_documento ENUM('graduacao', 'pos_graduacao', 'crm', 'crefito', 'coren', 'other'),
    numero_documento VARCHAR(100),
    instituicao VARCHAR(200),
    caminho_arquivo VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    data_submissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_verificacao TIMESTAMP NULL,
    verificado_por_admin INT,
    observacoes TEXT,
    id_profissional INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (verificado_por_admin) REFERENCES administradores(id_admin),
    FOREIGN KEY (id_profissional) REFERENCES profissionais_saude(id_profissional) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_usuario (id_usuario)
);

-- ======================================================
-- NOTIFICAÇÕES
-- ======================================================
CREATE TABLE      notificacoes (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_notificacao ENUM('like', 'comment', 'share', 'friendship', 'message', 'event', 'system', 'group_invite', 'advertencia') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT,
    url_relacionada VARCHAR(500),
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_amizade INT NULL,
    id_grupo INT NULL,
    id_evento INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_amizade) REFERENCES amizades(id_amizade) ON DELETE SET NULL,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE SET NULL,
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE SET NULL,
    INDEX idx_usuario (id_usuario),
    INDEX idx_tipo (tipo_notificacao),
    INDEX idx_lida (lida),
    INDEX idx_data_criacao (data_criacao),
    INDEX idx_amizade (id_amizade),
    INDEX idx_grupo (id_grupo),
    INDEX idx_evento (id_evento)
);

-- ======================================================
-- REPORTS (postagens, comentarios, grupos, eventos, amigos, usuarios)
-- ======================================================
CREATE TABLE      reports (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_postagem INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    snapshot_post TEXT NOT NULL,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_postagem (id_postagem),
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
);

CREATE TABLE      reports_comentarios (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_comentario INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    snapshot_comentario TEXT NOT NULL,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_comentario) REFERENCES comentarios(id_comentario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_comentario (id_comentario),
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
);

CREATE TABLE      reports_grupos (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_grupo INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    detalhes TEXT,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_grupo (id_grupo),
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
);

CREATE TABLE      reports_eventos (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_evento INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    detalhes TEXT,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_evento (id_evento),
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
);

CREATE TABLE      reports_amigos (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    motivo TEXT NOT NULL,
    detalhes TEXT,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_remetente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_remetente (id_remetente),
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_status (status)
);

CREATE TABLE      reports_usuarios (
    id_report INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL, -- usuário denunciado
    id_denunciante INT NOT NULL, -- quem fez a denúncia
    motivo TEXT NOT NULL,
    detalhes TEXT,
    data_report TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'reviewed', 'dismissed') DEFAULT 'pending',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_denunciante) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_denunciante (id_denunciante),
    INDEX idx_status (status)
);

-- ======================================================
-- ADVERTÊNCIAS
-- ======================================================
CREATE TABLE      advertencias (
    id_advertencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    detalhes TEXT,
    data_advertencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ativa', 'removida') DEFAULT 'ativa',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_status (status)
);

-- ======================================================
-- TRADUÇÕES (dependem de categorias, secoes, tags e idiomas)
-- ======================================================
CREATE TABLE      categorias_traducao (
    id_categoria INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (id_categoria, codigo_idioma),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

CREATE TABLE      secoes_traducao (
    id_secao INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_secao VARCHAR(100) NOT NULL,
    descricao_secao TEXT,
    PRIMARY KEY (id_secao, codigo_idioma),
    FOREIGN KEY (id_secao) REFERENCES secoes(id_secao) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

CREATE TABLE      tags_traducao (
    id_tag INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_tag VARCHAR(100) NOT NULL,
    descricao_tag TEXT,
    PRIMARY KEY (id_tag, codigo_idioma),
    FOREIGN KEY (id_tag) REFERENCES tags(id_tag) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

-- ======================================================
-- VIEWS
-- ======================================================
CREATE OR REPLACE VIEW vw_postagens_completas AS
SELECT 
    p.id_postagem,
    p.conteudo,
    p.tipo_postagem,
    p.artigo_cientifico,
    p.visualizacoes,
    p.data_criacao,
    u.nome_usuario,
    u.nome_real,
    u.sobrenome_real,
    u.verificado,
    u.foto_perfil,
    c.nome_categoria,
    c.cor_categoria,
    (SELECT COUNT(*) FROM curtidas WHERE id_postagem = p.id_postagem) as total_curtidas,
    (SELECT COUNT(*) FROM comentarios WHERE id_postagem = p.id_postagem) as total_comentarios,
    (SELECT COUNT(*) FROM compartilhamentos WHERE id_postagem = p.id_postagem) as total_compartilhamentos
FROM postagens p
JOIN usuarios u ON p.id_autor = u.id_usuario
LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
WHERE p.ativo = TRUE AND u.ativo = TRUE;

CREATE OR REPLACE VIEW vw_estatisticas_usuarios AS
SELECT 
    u.id_usuario,
    u.nome_usuario,
    u.verificado,
    (SELECT COUNT(*) FROM postagens WHERE id_autor = u.id_usuario AND ativo = TRUE) as total_posts,
    (SELECT COUNT(*) FROM amizades WHERE (id_solicitante = u.id_usuario OR id_destinatario = u.id_usuario) AND status_amizade = 'accepted') as total_amigos,
    (SELECT COUNT(*) FROM curtidas c JOIN postagens p ON c.id_postagem = p.id_postagem WHERE p.id_autor = u.id_usuario) as curtidas_recebidas
FROM usuarios u
WHERE u.ativo = TRUE;

-- ======================================================
-- TRIGGERS (contador de tags)
-- ======================================================
DELIMITER //
CREATE TRIGGER increment_tag_counter 
AFTER INSERT ON postagens_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET uso_contador = uso_contador + 1 WHERE id_tag = NEW.id_tag;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER decrement_tag_counter 
AFTER DELETE ON postagens_tags
FOR EACH ROW
BEGIN
    UPDATE tags SET uso_contador = uso_contador - 1 WHERE id_tag = OLD.id_tag AND uso_contador > 0;
END//
DELIMITER ;

-- ======================================================
-- ÍNDICES COMPOSTOS ADICIONAIS
-- ======================================================
CREATE INDEX      idx_postagens_autor_data ON postagens(id_autor, data_criacao);
CREATE INDEX      idx_postagens_categoria_data ON postagens(id_categoria, data_criacao);
CREATE INDEX      idx_amizades_status_data ON amizades(status_amizade, data_solicitacao);
CREATE INDEX      idx_eventos_data_tipo ON eventos(data_inicio, tipo_evento);

-- ======================================================
-- DADOS INICIAIS: idiomas, categorias e usuário admin padrão + registro em administradores
-- ======================================================

-- Idiomas básicos
INSERT IGNORE INTO idiomas (codigo_idioma, nome_idioma) VALUES
('pt-BR', 'Português (Brasil)'),
('en-US', 'English (United States)');

INSERT INTO categorias (nome_categoria, descricao, cor_categoria, ativo)
VALUES
  ('Dicas', 'Categoria para sugestões e dicas práticas.', '#28a745', TRUE),
  ('Relatos', 'Categoria para histórias e relatos pessoais.', '#17a2b8', TRUE),
  ('Artigos Científicos', 'Categoria para publicações e resumos científicos.', '#6f42c1', TRUE)
AS new
ON DUPLICATE KEY UPDATE
  nome_categoria = new.nome_categoria,
  descricao = new.descricao,
  cor_categoria = new.cor_categoria,
  ativo = new.ativo;


INSERT INTO usuarios (email, senha_hash, nome_real, sobrenome_real, nome_usuario, telefone, endereco, cidade, estado, cep, pais, verificado, foto_perfil, biografia, idioma_preferido, ativo)
VALUES ('ADM@HugDown.com', '$2b$10$x0At2mSVCc8E1nXzt6LkveaxpiBHTbpVkJsUBCMbgX1BMy7srvrI2', 'Administrador', 'Sistema', 'admin_hugdown', '+55-00-0000-0000', 'HQ HugDown', 'Cidade', 'Estado', '00000-000', 'Brasil', TRUE, NULL, 'Admin padrão do sistema', 'en-US', TRUE)
AS new
ON DUPLICATE KEY UPDATE
  senha_hash = new.senha_hash,
  verificado = new.verificado,
  ativo = new.ativo;
-- Adiciona o admin na tabela administradores como super_admin
-- Busca o id do usuário inserido (caso já exista, usamos o existente)
INSERT INTO administradores (id_usuario, nivel_admin)
SELECT u.id_usuario, 'super_admin' FROM usuarios u
WHERE u.email = 'ADM@HugDown.com'
AND NOT EXISTS (
    SELECT 1 FROM administradores a JOIN usuarios uu ON a.id_usuario = uu.id_usuario WHERE uu.email = 'ADM@HugDown.com'
);

INSERT IGNORE INTO temas_conversa (nome_tema, cor_tema, ativo) VALUES
('padrao', '#ffffff', TRUE),
('escuro', '#222831', TRUE),
('azul', '#007bff', TRUE),
('verde', '#28a745', TRUE),
('rosa', '#e83e8c', TRUE),
('amarelo', '#ffc107', TRUE);

