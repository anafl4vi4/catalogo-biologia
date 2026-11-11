
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriasApi, Categoria } from '../../servicos/categorias-api';
import { CabecalhoAdmin } from '../../componentes/cabecalho-admin/cabecalho-admin';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CabecalhoAdmin],
  templateUrl: './admin-categorias.html',
  styleUrl: './admin-categorias.css'
})
export class AdminCategorias implements OnInit {
  categorias: Categoria[] = [];

  categoria = {
    nome: '',
    descricao: ''
  };

  categoriaEditandoId: number | null = null;
  mensagem = '';
  erro = '';
  salvando = false;
  carregandoCategorias = false;

  constructor(
    private categoriasApi: CategoriasApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  limparMensagens(): void {
    this.mensagem = '';
    this.erro = '';
  }

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

  salvarCategoria(): void {
    this.limparMensagens();

    const dados = {
      nome: this.categoria.nome.trim(),
      descricao: this.categoria.descricao.trim()
    };

    if (!dados.nome) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    this.salvando = true;

    const requisicao = this.categoriaEditandoId === null
      ? this.categoriasApi.cadastrar(dados)
      : this.categoriasApi.atualizar(this.categoriaEditandoId, dados);

    requisicao.subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem || 'Categoria salva com sucesso!';
        this.salvando = false;
        this.limparFormulario();
        this.listarCategorias();
        this.cdr.markForCheck();
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

  editarCategoria(categoria: Categoria): void {
    this.limparMensagens();
    this.categoriaEditandoId = categoria.id;

    this.categoria = {
      nome: categoria.nome,
      descricao: categoria.descricao || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
  }

  cancelarEdicao(): void {
    this.limparFormulario();
    this.limparMensagens();
  }

  excluirCategoria(id: number): void {
    if (!window.confirm('Tem certeza de que deseja excluir esta categoria?')) {
      return;
    }

    this.limparMensagens();

    this.categoriasApi.excluir(id).subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem || 'Categoria excluída com sucesso!';
        this.listarCategorias();
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao excluir categoria:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível excluir a categoria.';
        this.cdr.markForCheck();
      }
    });
  }

  limparFormulario(): void {
    this.categoria = {
      nome: '',
      descricao: ''
    };
    this.categoriaEditandoId = null;
  }
}
