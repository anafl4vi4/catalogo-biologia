
const express = require('express');
const cors = require('cors');

const app = express();
const PORTA = 3000;

// Permite que o Angular faça requisições à API.
app.use(cors());
app.use(express.json());

// Dados temporários para a primeira versão.
const laminas = [
  {
    id: 1,
    nome: 'Tecido Epitelial',
    categoria: 'Histologia',
    descricao: 'Lâmina para observação de estruturas do tecido epitelial.',
    aumento: '400x',
    material: 'Microscópica',
    icone: '🔬'
  },
  {
    id: 2,
    nome: 'Célula Vegetal',
    categoria: 'Botânica',
    descricao: 'Observação das principais estruturas presentes em células vegetais.',
    aumento: '400x',
    material: 'Vegetal',
    icone: '🌱'
  },
  {
    id: 3,
    nome: 'Bactérias',
    categoria: 'Microbiologia',
    descricao: 'Lâmina destinada à observação de diferentes tipos de bactérias.',
    aumento: '1000x',
    material: 'Microbiológica',
    icone: '🦠'
  },
  {
    id: 4,
    nome: 'Tecido Muscular',
    categoria: 'Histologia',
    descricao: 'Lâmina para estudo das características do tecido muscular.',
    aumento: '400x',
    material: 'Animal',
    icone: '🫀'
  }
];

// Rota inicial para verificar se o servidor está funcionando.
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API do Catálogo de Biologia funcionando!'
  });
});

// Retorna todas as lâminas.
app.get('/api/laminas', (req, res) => {
  res.json(laminas);
});

// Retorna uma lâmina pelo ID.
app.get('/api/laminas/:id', (req, res) => {
  const id = Number(req.params.id);
  const lamina = laminas.find(item => item.id === id);

  if (!lamina) {
    return res.status(404).json({
      mensagem: 'Lâmina não encontrada.'
    });
  }

  res.json(lamina);
});

// Inicia o servidor.
app.listen(PORTA, () => {
  console.log(`Backend rodando em http://localhost:${PORTA}`);
});
