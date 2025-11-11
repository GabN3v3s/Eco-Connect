CREATE DATABASE IF NOT EXISTS doacoes_ambientais;
USE doacoes_ambientais;

-- Tabela de Usuários (Doador ou Organização)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,  
    tipo ENUM('doador', 'organizacao') NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE,
    causa_ambiental VARCHAR(255),  
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Projetos
CREATE TABLE projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    localizacao VARCHAR(255),  -- Ex: latitude,longitude para mapa
    metas TEXT,
    valor_necessario DECIMAL(10,2),
    foto_path VARCHAR(255),
    usuario_id INT,
    istatus ENUM('ativo', 'concluido') DEFAULT 'ativo',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    	    id_cat INT NOT NULL,
	    FOREIGN KEY (id_cat) REFERENCES categorias(id)
);




-- Tabela de Doações
CREATE TABLE doacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doador_id INT,
    projeto_id INT,
    valor DECIMAL(10,2) NOT NULL,
    data_doacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doador_id) REFERENCES usuarios(id),
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

-- Tabela de Relatórios (para transparência)
CREATE TABLE relatorios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    projeto_id INT,
    titulo VARCHAR(255),
    descricao TEXT,
    valor_utilizado DECIMAL(10,2),
    progresso TEXT,  -- Ex: "Área reflorestada: 10ha"
    data_relatorio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

CREATE TABLE categorias(
    id INT AUTO_INCREMENT PRIMARY KEY,
	    nome VARCHAR(100) NOT NULL,
	    descricao TEXT);

INSERT INTO usuarios (nome, email, senha, tipo, cpf_cnpj, causa_ambiental) VALUES
('Maria Silva', 'maria.silva@email.com', '123456', 'doador', '123.456.789-00', NULL),
('João Santos', 'joao.santos@email.com', '123456', 'doador', '987.654.321-00', NULL),
('Instituto Verde Vida', 'contato@verdevida.org', '123456', 'organizacao', '12.345.678/0001-99', 'Reflorestamento'),
('ONG Mar Azul', 'contato@marazul.org', '123456', 'organizacao', '98.765.432/0001-11', 'Conservação Marinha'),
('Ana Costa', 'ana.costa@email.com', '123456', 'doador', '321.654.987-00', NULL);
INSERT INTO categorias (nome, descricao) VALUES 
('Reflorestamento', 'Projetos de plantio e recuperação de áreas florestais degradadas'),
('Energia Limpa', 'Implementação de energia solar, eólica e outras fontes renováveis'),
('Reciclagem', 'Gestão de resíduos, coleta seletiva e processos de reciclagem'),
('Água & Oceanos', 'Preservação de recursos hídricos, rios, lagos e mares'),
('Proteção Animal', 'Conservação da fauna e proteção de espécies ameaçadas');

INSERT INTO projetos (nome, descricao, localizacao, metas, valor_necessario, foto_path, usuario_id, istatus) VALUES
('Reflorestamento da Mata Atlântica', 'Restaurar áreas degradadas da Mata Atlântica com espécies nativas.', 'São Paulo - SP', 'Plantio de 10.000 árvores até 2025', 250000.00, 'imagens/mata.jpg', 3, 'ativo'),
('Conservação Marinha Litoral Norte', 'Proteção de recifes de coral e limpeza de praias no litoral norte.', 'Ubatuba - SP', 'Limpeza de 20 km de costa', 180000.00, 'imagens/mar.jpg', 4, 'ativo'),
('Educação Ambiental nas Escolas', 'Campanha de educação ambiental em escolas públicas.', 'Rio de Janeiro - RJ', '50 escolas participantes', 120000.00, 'imagens/educacao.jpg', 3, 'ativo'),
('Energia Solar Comunitária', 'Instalação de painéis solares em comunidades da Amazônia.', 'Manaus - AM', '10 comunidades atendidas', 450000.00, 'imagens/solar.jpg', 4, 'ativo'),
('Proteção da Biodiversidade do Cerrado', 'Monitoramento de espécies ameaçadas no Cerrado.', 'Brasília - DF', 'Instalar 100 câmeras de monitoramento', 320000.00, 'imagens/cerrado.jpg', 3, 'ativo');

INSERT INTO doacoes (doador_id, projeto_id, valor) VALUES
(1, 1, 500.00),
(2, 2, 250.00),
(5, 1, 1000.00),
(1, 3, 200.00),
(2, 4, 350.00);

INSERT INTO relatorios (projeto_id, titulo, descricao, valor_utilizado, progresso) VALUES
(1, 'Etapa 1 - Plantio inicial', 'Plantadas 1.000 mudas de árvores nativas.', 50000.00, 'Área reflorestada: 5ha'),
(2, 'Etapa 1 - Limpeza costeira', 'Limpeza de 5 km de praias e coleta de 2 toneladas de lixo.', 60000.00, 'Área limpa: 5 km'),
(3, 'Etapa 1 - Oficinas educativas', 'Realizadas palestras e oficinas em 10 escolas.', 40000.00, 'Alunos participantes: 800'),
(4, 'Etapa 1 - Instalação inicial', 'Painéis solares instalados em 3 comunidades.', 150000.00, 'Comunidades atendidas: 3'),
(5, 'Etapa 1 - Monitoramento', 'Instalação de 25 câmeras de vigilância da fauna.', 80000.00, 'Câmeras instaladas: 25');

ALTER TABLE projetos 
ADD COLUMN categoria VARCHAR(255),
ADD COLUMN arrecadado DECIMAL(10,2) DEFAULT 0;

-- Add sample categories to match frontend
UPDATE projetos SET categoria = 'reflorestamento' WHERE id = 1;
UPDATE projetos SET categoria = 'conservacao-marinha' WHERE id = 2;
UPDATE projetos SET categoria = 'educacao-ambiental' WHERE id = 3;
UPDATE projetos SET categoria = 'energia-renovavel' WHERE id = 4;
UPDATE projetos SET categoria = 'biodiversidade' WHERE id = 5;