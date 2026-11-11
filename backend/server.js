
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORTA = 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

app.use(cors());
app.use(express.json());

// ==========================================
// ROTA INICIAL
// ==========================================

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do LIBRA funcionando!'
  });
});

// ==========================================
// CONSULTA PADRÃO DE LÂMINAS
// ==========================================

const consultaLaminas = `
  SELECT
    l.id,
    l.codigo,
    l.nome,
    l.nome_cientifico,
    c.nome AS categoria,
    l.tipo_material_biologico,
    l.descricao,
    l.material,
    l.aumento,
    l.numero_patrimonio,
    l.quantidade,
    l.data_cadastro,
    l.ultima_atualizacao,
    l.responsavel_cadastro_id,
    l.origem,
    l.estruturas_observadas,
    l.estado_conservacao,
    l.imagem,
    l.local,
    l.referencias_bibliograficas,
    l.observacoes,
    CASE
      WHEN c.nome = 'Histologia' THEN '🔬'
      WHEN c.nome = 'Botânica' THEN '🌱'
      WHEN c.nome = 'Microbiologia' THEN '🦠'
      WHEN c.nome = 'Citologia' THEN '🧫'
      ELSE '🧪'
    END AS icone
  FROM laminas l
  INNER JOIN categorias c ON l.categoria_id = c.id
`;

// ==========================================
// LISTAR TODAS AS LÂMINAS
// ==========================================

app.get('/api/laminas', async (req, res) => {
  try {
    const resultado = await pool.query(
      `${consultaLaminas} ORDER BY l.id`
    );

    res.json(resultado.rows);

  } catch (erro) {
    console.error('Erro ao buscar lâminas:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar as lâminas no banco de dados.'
    });
  }
});

// ==========================================
// BUSCAR UMA LÂMINA PELO ID
// ==========================================

app.get('/api/laminas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      `${consultaLaminas} WHERE l.id = $1`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Lâmina não encontrada.'
      });
    }

    res.json(resultado.rows[0]);

  } catch (erro) {
    console.error('Erro ao buscar lâmina:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar a lâmina no banco de dados.'
    });
  }
});

// ==========================================
// CADASTRAR UMA LÂMINA
// ==========================================

app.post('/api/laminas', async (req, res) => {
  const {
    codigo,
    nome,
    nome_cientifico,
    categoria,
    tipo_material_biologico,
    descricao,
    material,
    aumento,
    numero_patrimonio,
    quantidade,
    origem,
    estruturas_observadas,
    estado_conservacao,
    imagem,
    local,
    referencias_bibliograficas,
    observacoes
  } = req.body;

  if (!codigo || !nome || !categoria) {
    return res.status(400).json({
      mensagem: 'Código, nome e categoria são obrigatórios.'
    });
  }

  const estadosPermitidos = [
    'Novo',
    'Regular',
    'Velho',
    'Danificado'
  ];

  if (
    estado_conservacao &&
    !estadosPermitidos.includes(estado_conservacao)
  ) {
    return res.status(400).json({
      mensagem: 'Estado de conservação inválido.'
    });
  }

  try {
    const categoriaResultado = await pool.query(
      'SELECT id FROM categorias WHERE nome = $1',
      [categoria]
    );

    if (categoriaResultado.rows.length === 0) {
      return res.status(400).json({
        mensagem: 'Categoria não encontrada.'
      });
    }

    const categoriaId = categoriaResultado.rows[0].id;

    const resultado = await pool.query(`
      INSERT INTO laminas (
        codigo,
        nome,
        nome_cientifico,
        categoria_id,
        tipo_material_biologico,
        descricao,
        material,
        aumento,
        numero_patrimonio,
        quantidade,
        origem,
        estruturas_observadas,
        estado_conservacao,
        imagem,
        local,
        referencias_bibliograficas,
        observacoes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9,
        $10, $11, $12, $13, $14, $15, $16, $17
      )
      RETURNING *;
    `, [
      codigo,
      nome,
      nome_cientifico || null,
      categoriaId,
      tipo_material_biologico || null,
      descricao || null,
      material || null,
      aumento || null,
      numero_patrimonio || null,
      quantidade ?? 0,
      origem || null,
      estruturas_observadas || null,
      estado_conservacao || null,
      imagem || null,
      local || null,
      referencias_bibliograficas || null,
      observacoes || null
    ]);

    res.status(201).json({
      mensagem: 'Lâmina cadastrada com sucesso!',
      lamina: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao cadastrar lâmina:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Já existe uma lâmina com esse código.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao cadastrar a lâmina.'
    });
  }
});

// ==========================================
// EDITAR UMA LÂMINA
// ==========================================

app.put('/api/laminas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID da lâmina inválido.'
    });
  }

  const {
    codigo,
    nome,
    nome_cientifico,
    categoria,
    tipo_material_biologico,
    descricao,
    material,
    aumento,
    numero_patrimonio,
    quantidade,
    origem,
    estruturas_observadas,
    estado_conservacao,
    imagem,
    local,
    referencias_bibliograficas,
    observacoes
  } = req.body;

  if (!codigo || !nome || !categoria) {
    return res.status(400).json({
      mensagem: 'Código, nome e categoria são obrigatórios.'
    });
  }

  const estadosPermitidos = [
    'Novo',
    'Regular',
    'Velho',
    'Danificado'
  ];

  if (
    estado_conservacao &&
    !estadosPermitidos.includes(estado_conservacao)
  ) {
    return res.status(400).json({
      mensagem: 'Estado de conservação inválido.'
    });
  }

  try {
    const categoriaResultado = await pool.query(
      'SELECT id FROM categorias WHERE nome = $1',
      [categoria]
    );

    if (categoriaResultado.rows.length === 0) {
      return res.status(400).json({
        mensagem: 'Categoria não encontrada.'
      });
    }

    const categoriaId = categoriaResultado.rows[0].id;

    const resultado = await pool.query(`
      UPDATE laminas
      SET
        codigo = $1,
        nome = $2,
        nome_cientifico = $3,
        categoria_id = $4,
        tipo_material_biologico = $5,
        descricao = $6,
        material = $7,
        aumento = $8,
        numero_patrimonio = $9,
        quantidade = $10,
        origem = $11,
        estruturas_observadas = $12,
        estado_conservacao = $13,
        imagem = $14,
        local = $15,
        referencias_bibliograficas = $16,
        observacoes = $17
      WHERE id = $18
      RETURNING *;
    `, [
      codigo,
      nome,
      nome_cientifico || null,
      categoriaId,
      tipo_material_biologico || null,
      descricao || null,
      material || null,
      aumento || null,
      numero_patrimonio || null,
      quantidade ?? 0,
      origem || null,
      estruturas_observadas || null,
      estado_conservacao || null,
      imagem || null,
      local || null,
      referencias_bibliograficas || null,
      observacoes || null,
      id
    ]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Lâmina não encontrada.'
      });
    }

    res.json({
      mensagem: 'Lâmina atualizada com sucesso!',
      lamina: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao atualizar lâmina:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Já existe uma lâmina com esse código.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao atualizar a lâmina.'
    });
  }
});

// ==========================================
// EXCLUIR UMA LÂMINA
// ==========================================

app.delete('/api/laminas/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID da lâmina inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      'DELETE FROM laminas WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Lâmina não encontrada.'
      });
    }

    res.json({
      mensagem: 'Lâmina excluída com sucesso!',
      lamina: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao excluir lâmina:', erro);

    res.status(500).json({
      mensagem: 'Erro ao excluir a lâmina.'
    });
  }
});

// ==========================================
// ROTAS DE CATEGORIAS
// ==========================================

app.get('/api/categorias', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT id, nome, descricao FROM categorias ORDER BY id'
    );

    res.json(resultado.rows);

  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);

    res.status(500).json({
      mensagem: 'Erro ao buscar categorias.'
    });
  }
});

app.post('/api/categorias', async (req, res) => {
  const { nome, descricao } = req.body;

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({
      mensagem: 'O nome da categoria é obrigatório.'
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO categorias (nome, descricao)
       VALUES ($1, $2)
       RETURNING id, nome, descricao`,
      [nome.trim(), descricao?.trim() || null]
    );

    res.status(201).json({
      mensagem: 'Categoria cadastrada com sucesso!',
      categoria: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao cadastrar categoria:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Já existe uma categoria com esse nome.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao cadastrar categoria.'
    });
  }
});

app.put('/api/categorias/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID da categoria inválido.'
    });
  }

  if (!nome || typeof nome !== 'string' || !nome.trim()) {
    return res.status(400).json({
      mensagem: 'O nome da categoria é obrigatório.'
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE categorias
       SET nome = $1, descricao = $2
       WHERE id = $3
       RETURNING id, nome, descricao`,
      [nome.trim(), descricao?.trim() || null, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Categoria não encontrada.'
      });
    }

    res.json({
      mensagem: 'Categoria atualizada com sucesso!',
      categoria: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao atualizar categoria:', erro);

    if (erro.code === '23505') {
      return res.status(409).json({
        mensagem: 'Já existe uma categoria com esse nome.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao atualizar categoria.'
    });
  }
});

app.delete('/api/categorias/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      mensagem: 'ID da categoria inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      'DELETE FROM categorias WHERE id = $1 RETURNING *',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        mensagem: 'Categoria não encontrada.'
      });
    }

    res.json({
      mensagem: 'Categoria excluída com sucesso!',
      categoria: resultado.rows[0]
    });

  } catch (erro) {
    console.error('Erro ao excluir categoria:', erro);

    if (erro.code === '23503') {
      return res.status(409).json({
        mensagem: 'Não é possível excluir esta categoria porque existem lâminas vinculadas a ela.'
      });
    }

    res.status(500).json({
      mensagem: 'Erro ao excluir categoria.'
    });
  }
});

// ==========================================
// INICIALIZAÇÃO DO SERVIDOR
// ==========================================

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Conexão com PostgreSQL estabelecida!');

    app.listen(PORTA, () => {
      console.log(`Backend rodando em http://localhost:${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error(
      'Não foi possível conectar ao PostgreSQL:',
      erro.message
    );
  });