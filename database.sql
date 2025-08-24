CREATE DATABASE HugDown_rede_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE HugDown_rede_social;

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255)  NOT NULL,
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
    INDEX idx_email (email),
    INDEX idx_nome_usuario (nome_usuario),
    INDEX idx_verificado (verificado),
    INDEX idx_ativo (ativo)
);

CREATE TABLE administradores (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nivel_admin ENUM('super_admin', 'moderator', 'verifier') NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_nivel (nivel_admin)
);

CREATE TABLE documentos_verificacao (
    id_documento INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_documento ENUM('graduacao', 'pos_graduacao', 'crm', 'crefito', 'coren', 'other'),
    numero_documento VARCHAR(100),
    instituicao VARCHAR(200) ,
    caminho_arquivo VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'under_review') DEFAULT 'pending',
    data_submissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_verificacao TIMESTAMP NULL,
    verificado_por_admin INT,
    observacoes TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (verificado_por_admin) REFERENCES administradores(id_admin),
    INDEX idx_status (status),
    INDEX idx_usuario (id_usuario)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    cor_categoria VARCHAR(7) DEFAULT '#007bff',
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_ativo (ativo)
);

CREATE TABLE secoes (
    id_secao INT AUTO_INCREMENT PRIMARY KEY,
    nome_secao VARCHAR(100) NOT NULL,
    descricao_secao TEXT,
    icone_secao VARCHAR(50),
    ordem_exibicao INT DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    INDEX idx_ordem (ordem_exibicao),
    INDEX idx_ativo (ativo)
);

CREATE TABLE tags (
    id_tag INT AUTO_INCREMENT PRIMARY KEY,
    nome_tag VARCHAR(100) UNIQUE NOT NULL,
    descricao_tag TEXT,
    uso_contador INT DEFAULT 0,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome_tag (nome_tag),
    INDEX idx_uso_contador (uso_contador)
);

CREATE TABLE postagens (
    id_postagem INT AUTO_INCREMENT PRIMARY KEY,
    id_autor INT NOT NULL,
    id_categoria INT,
    id_tag INT,
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
    FOREIGN KEY (id_tag) REFERENCES tags(id_tag),
    INDEX idx_autor (id_autor),
    INDEX idx_categoria (id_categoria),
    INDEX idx_tipo (tipo_postagem),
    INDEX idx_artigo_cientifico (artigo_cientifico),
    INDEX idx_data_criacao (data_criacao),
    INDEX idx_ativo (ativo)
);
CREATE TABLE postagens_secoes (
    id_postagem INT NOT NULL,
    id_secao INT NOT NULL,
    PRIMARY KEY (id_postagem, id_secao),
    FOREIGN KEY (id_postagem) REFERENCES postagens(id_postagem) ON DELETE CASCADE,
    FOREIGN KEY (id_secao) REFERENCES secoes(id_secao) ON DELETE CASCADE
);

CREATE TABLE comentarios (
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

CREATE TABLE curtidas (
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

CREATE TABLE compartilhamentos (
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

CREATE TABLE amizades (
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

CREATE TABLE mensagens_diretas (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    id_remetente INT NOT NULL,
    id_destinatario INT NOT NULL,
    conteudo TEXT,
    url_midia VARCHAR(500),
    tipo_midia VARCHAR(50),
    lida BOOLEAN DEFAULT FALSE,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_remetente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_destinatario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_remetente (id_remetente),
    INDEX idx_destinatario (id_destinatario),
    INDEX idx_lida (lida),
    INDEX idx_data_envio (data_envio)
);

CREATE TABLE eventos (
    id_evento INT AUTO_INCREMENT PRIMARY KEY,
    id_organizador INT NOT NULL,
    id_categoria INT,
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
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    INDEX idx_organizador (id_organizador),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_tipo_evento (tipo_evento),
    INDEX idx_ativo (ativo)
);

CREATE TABLE participantes_evento (
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

CREATE TABLE grupos (
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

CREATE TABLE membros_grupo (
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
CREATE TABLE notificacoes (
    id_notificacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    tipo_notificacao ENUM('like', 'comment', 'share', 'friendship', 'message', 'event', 'system') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensagem TEXT,
    url_relacionada VARCHAR(500),
    lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_tipo (tipo_notificacao),
    INDEX idx_lida (lida),
    INDEX idx_data_criacao (data_criacao)
);

-- 1. Tabela de idiomas suportados
CREATE TABLE idiomas (
    codigo_idioma VARCHAR(10) PRIMARY KEY, -- ex: 'pt-BR', 'en-US'
    nome_idioma VARCHAR(100) NOT NULL
);

-- 2. Tradução de categorias
CREATE TABLE categorias_traducao (
    id_categoria INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_categoria VARCHAR(100) NOT NULL,
    descricao TEXT,
    PRIMARY KEY (id_categoria, codigo_idioma),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

-- 3. Tradução de seções
CREATE TABLE secoes_traducao (
    id_secao INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_secao VARCHAR(100) NOT NULL,
    descricao_secao TEXT,
    PRIMARY KEY (id_secao, codigo_idioma),
    FOREIGN KEY (id_secao) REFERENCES secoes(id_secao) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

-- 4. Tradução de tags
CREATE TABLE tags_traducao (
    id_tag INT NOT NULL,
    codigo_idioma VARCHAR(10) NOT NULL,
    nome_tag VARCHAR(100) NOT NULL,
    descricao_tag TEXT,
    PRIMARY KEY (id_tag, codigo_idioma),
    FOREIGN KEY (id_tag) REFERENCES tags(id_tag) ON DELETE CASCADE,
    FOREIGN KEY (codigo_idioma) REFERENCES idiomas(codigo_idioma)
);

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

CREATE VIEW vw_postagens_completas AS
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

CREATE VIEW vw_estatisticas_usuarios AS
SELECT 
    u.id_usuario,
    u.nome_usuario,
    u.verificado,
    (SELECT COUNT(*) FROM postagens WHERE id_autor = u.id_usuario AND ativo = TRUE) as total_posts,
    (SELECT COUNT(*) FROM amizades WHERE (id_solicitante = u.id_usuario OR id_destinatario = u.id_usuario) AND status_amizade = 'aceito') as total_amigos,
    (SELECT COUNT(*) FROM curtidas c JOIN postagens p ON c.id_postagem = p.id_postagem WHERE p.id_autor = u.id_usuario) as curtidas_recebidas
FROM usuarios u
WHERE u.ativo = TRUE;

CREATE INDEX idx_postagens_autor_data ON postagens(id_autor, data_criacao DESC);
CREATE INDEX idx_postagens_categoria_data ON postagens(id_categoria, data_criacao DESC);
CREATE INDEX idx_amizades_status_data ON amizades(status_amizade, data_solicitacao);
CREATE INDEX idx_eventos_data_tipo ON eventos(data_inicio, tipo_evento);

