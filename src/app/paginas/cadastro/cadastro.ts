
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  LaminasApi,
  Lamina
} from '../../servicos/laminas-api';

import {
  CategoriasApi,
  Categoria
} from '../../servicos/categorias-api';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro implements OnInit {

  // Controla qual aba está aberta.
  abaAtiva: 'laminas' | 'categorias' = 'laminas';

  // Dados do formulário de lâminas.
  lamina = this.novaLamina();

  // Lista de lâminas cadastradas.
  laminas: Lamina[] = [];

  // Identifica se uma lâmina está sendo editada.
  laminaEditandoId: number | null = null;

  // Dados das categorias.
  categorias: Categoria[] = [];

  categoria = {
    nome: '',
    descricao: ''
  };

  categoriaEditandoId: number | null = null;

  // Mensagens e controles.
  mensagem = '';
  erro = '';

  salvando = false;
  carregandoCategorias = false;
  carregandoLaminas = false;

  constructor(
    private laminasApi: LaminasApi,
    private categoriasApi: CategoriasApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
    this.listarLaminas();
  }

  // Cria um formulário vazio para uma nova lâmina.
  novaLamina() {
    return {
      codigo: '',
      nome: '',
      nome_cientifico: '',
      categoria: '',
      tipo_material_biologico: '',
      descricao: '',
      material: '',
      aumento: '',
      numero_patrimonio: '',
      quantidade: 0,
      origem: '',
      estruturas_observadas: '',
      estado_conservacao: 'Novo',
      imagem: '',
      local: '',
      referencias_bibliograficas: '',
      observacoes: ''
    };
  }

  // Alterna entre as abas.
  trocarAba(aba: 'laminas' | 'categorias'): void {
    this.abaAtiva = aba;
    this.limparMensagens();
  }

  // Limpa as mensagens.
  limparMensagens(): void {
    this.mensagem = '';
    this.erro = '';
  }

  // Busca as categorias no banco de dados.
  listarCategorias(): void {
    this.carregandoCategorias = true;

    this.categoriasApi.listar().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.carregandoCategorias = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao listar categorias:', erro);
        this.erro = 'Não foi possível carregar as categorias.';
        this.carregandoCategorias = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Busca as lâminas no banco de dados.
  listarLaminas(): void {
    this.carregandoLaminas = true;

    this.laminasApi.listar().subscribe({
      next: (laminas) => {
        this.laminas = laminas;
        this.carregandoLaminas = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao listar lâminas:', erro);
        this.erro = 'Não foi possível carregar as lâminas.';
        this.carregandoLaminas = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Cadastra ou atualiza uma lâmina.
  cadastrar(): void {
    this.limparMensagens();

    if (!this.lamina.codigo.trim() ||
        !this.lamina.nome.trim() ||
        !this.lamina.categoria.trim()) {
      this.erro = 'Preencha o código, o nome e a categoria da lâmina.';
      return;
    }

    this.salvando = true;

    const dados = { ...this.lamina };

    const requisicao = this.laminaEditandoId === null
      ? this.laminasApi.cadastrar(dados)
      : this.laminasApi.atualizar(this.laminaEditandoId, dados);

    requisicao.subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem ||
          (this.laminaEditandoId === null
            ? 'Lâmina cadastrada com sucesso!'
            : 'Lâmina atualizada com sucesso!');

        this.salvando = false;
        this.cancelarEdicaoLamina();
        this.cdr.markForCheck();

        this.listarLaminas();
      },
      error: (erro) => {
        console.error('Erro ao salvar lâmina:', erro);

        this.erro = erro.error?.mensagem ||
          'Não foi possível salvar a lâmina.';

        this.salvando = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Preenche o formulário com os dados da lâmina selecionada.
  editarLamina(lamina: Lamina): void {
    this.limparMensagens();
    this.laminaEditandoId = lamina.id;

    this.lamina = {
      codigo: lamina.codigo || '',
      nome: lamina.nome || '',
      nome_cientifico: lamina.nome_cientifico || '',
      categoria: lamina.categoria || '',
      tipo_material_biologico: lamina.tipo_material_biologico || '',
      descricao: lamina.descricao || '',
      material: lamina.material || '',
      aumento: lamina.aumento || '',
      numero_patrimonio: lamina.numero_patrimonio || '',
      quantidade: lamina.quantidade ?? 0,
      origem: lamina.origem || '',
      estruturas_observadas: lamina.estruturas_observadas || '',
      estado_conservacao: lamina.estado_conservacao || 'Novo',
      imagem: lamina.imagem || '',
      local: lamina.local || '',
      referencias_bibliograficas: lamina.referencias_bibliograficas || '',
      observacoes: lamina.observacoes || ''
    };

    this.abaAtiva = 'laminas';
    this.cdr.markForCheck();
  }

  // Cancela a edição ou limpa o formulário.
  cancelarEdicaoLamina(): void {
    this.lamina = this.novaLamina();
    this.laminaEditandoId = null;
    this.cdr.markForCheck();
  }

  // Exclui uma lâmina.
  excluirLamina(id: number): void {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta lâmina?'
    );

    if (!confirmar) return;

    this.limparMensagens();

    this.laminasApi.excluir(id).subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem ||
          'Lâmina excluída com sucesso!';

        if (this.laminaEditandoId === id) {
          this.cancelarEdicaoLamina();
        }

        this.cdr.markForCheck();
        this.listarLaminas();
      },
      error: (erro) => {
        console.error('Erro ao excluir lâmina:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível excluir a lâmina.';
        this.cdr.markForCheck();
      }
    });
  }

  // Cadastra ou atualiza uma categoria.
  salvarCategoria(): void {
    this.limparMensagens();

    const dados = {
      nome: this.categoria.nome.trim(),
      descricao: this.categoria.descricao.trim()
    };

    if (!dados.nome) {
      this.erro = 'Informe o nome da categoria.';
      this.cdr.markForCheck();
      return;
    }

    this.salvando = true;

    const requisicao = this.categoriaEditandoId === null
      ? this.categoriasApi.cadastrar(dados)
      : this.categoriasApi.atualizar(this.categoriaEditandoId, dados);

    requisicao.subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem ||
          'Categoria salva com sucesso!';

        this.salvando = false;
        this.limparFormularioCategoria();
        this.cdr.markForCheck();
        this.listarCategorias();
      },
      error: (erro) => {
        console.error('Erro ao salvar categoria:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível salvar a categoria.';
        this.salvando = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Preenche o formulário com os dados da categoria selecionada.
  editarCategoria(categoria: Categoria): void {
    this.limparMensagens();
    this.categoriaEditandoId = categoria.id;

    this.categoria = {
      nome: categoria.nome,
      descricao: categoria.descricao || ''
    };

    this.abaAtiva = 'categorias';
    this.cdr.markForCheck();
  }

  // Cancela a edição da categoria.
  cancelarEdicao(): void {
    this.limparFormularioCategoria();
    this.limparMensagens();
    this.cdr.markForCheck();
  }

  // Exclui uma categoria.
  excluirCategoria(id: number): void {
    const confirmar = window.confirm(
      'Tem certeza de que deseja excluir esta categoria?'
    );

    if (!confirmar) return;

    this.limparMensagens();

    this.categoriasApi.excluir(id).subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem ||
          'Categoria excluída com sucesso!';
        this.cdr.markForCheck();
        this.listarCategorias();
      },
      error: (erro) => {
        console.error('Erro ao excluir categoria:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível excluir a categoria.';
        this.cdr.markForCheck();
      }
    });
  }

  // Limpa o formulário de categoria.
  limparFormularioCategoria(): void {
    this.categoria = {
      nome: '',
      descricao: ''
    };

    this.categoriaEditandoId = null;
  }
}
