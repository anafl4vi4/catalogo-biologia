import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LaminasApi, Lamina } from '../../servicos/laminas-api';
import { CategoriasApi, Categoria } from '../../servicos/categorias-api';
import { CabecalhoAdmin } from '../../componentes/cabecalho-admin/cabecalho-admin';

@Component({
  selector: 'app-admin-laminas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CabecalhoAdmin],
  templateUrl: './admin-laminas.html',
  styleUrl: './admin-laminas.css'
})
export class AdminLaminas implements OnInit {
  lamina = this.novaLamina();
  laminas: Lamina[] = [];
  categorias: Categoria[] = [];
  laminaEditandoId: number | null = null;

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

  novaLamina() {
    return {
      codigo: '',
      nome: '',
      nome_cientifico: '',
      categoria: '',
      tipo_material_biologico: '',
      descricao: '',
      aumento_maximo: '',
      o_que_e: '',
      funcao: '',
      numero_patrimonio: '',
      quantidade: 0,
      estado_conservacao: 'Íntegra',
      imagem: '',
      local: '',
      referencias_bibliograficas: '',
      observacoes: ''
    };
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

  cadastrar(): void {
    this.limparMensagens();

    if (
      !this.lamina.codigo.trim() ||
      !this.lamina.nome.trim() ||
      !this.lamina.categoria.trim()
    ) {
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
        this.listarLaminas();
        this.cdr.markForCheck();
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
      aumento_maximo: lamina.aumento_maximo || '',
      o_que_e: lamina.o_que_e || '',
      funcao: lamina.funcao || '',
      numero_patrimonio: lamina.numero_patrimonio || '',
      quantidade: lamina.quantidade ?? 0,
      estado_conservacao: lamina.estado_conservacao || 'Íntegra',
      imagem: lamina.imagem || '',
      local: lamina.local || '',
      referencias_bibliograficas: lamina.referencias_bibliograficas || '',
      observacoes: lamina.observacoes || ''
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.cdr.markForCheck();
  }

  cancelarEdicaoLamina(): void {
    this.lamina = this.novaLamina();
    this.laminaEditandoId = null;
    this.cdr.markForCheck();
  }

  excluirLamina(id: number): void {
    if (!window.confirm('Tem certeza de que deseja excluir esta lâmina?')) {
      return;
    }

    this.limparMensagens();

    this.laminasApi.excluir(id).subscribe({
      next: (resposta) => {
        this.mensagem = resposta.mensagem || 'Lâmina excluída com sucesso!';

        if (this.laminaEditandoId === id) {
          this.cancelarEdicaoLamina();
        }

        this.listarLaminas();
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.error('Erro ao excluir lâmina:', erro);
        this.erro = erro.error?.mensagem ||
          'Não foi possível excluir a lâmina.';
        this.cdr.markForCheck();
      }
    });
  }
}