import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Cabeca } from '../../componentes/cabeca/cabeca';
import { Pesquisa } from '../../componentes/pesquisa/pesquisa';

import { LaminasApi, Lamina } from '../../servicos/laminas-api';
import { CategoriasApi, Categoria } from '../../servicos/categorias-api';

@Component({
  selector: 'app-laminas',
  standalone: true,
  imports: [CommonModule, Cabeca, Pesquisa],
  templateUrl: './laminas.html',
  styleUrl: './laminas.css'
})
export class Laminas {

  laminas: Lamina[] = [];
  categorias: Categoria[] = [];

  termoPesquisa = '';
  categoriaSelecionada = 'Todas';

  carregandoLaminas = true;
  erroCarregamento = false;

  laminaSelecionada: Lamina | null = null;

  constructor(
    private laminasApi: LaminasApi,
    private categoriasApi: CategoriasApi,
    private cdr: ChangeDetectorRef
  ) {
    this.listarLaminas();
    this.listarCategorias();
  }

  listarLaminas(): void {
    this.carregandoLaminas = true;
    this.erroCarregamento = false;

    this.laminasApi.listar().subscribe({

      next: (dados) => {
        this.laminas = [...dados];
        this.carregandoLaminas = false;

        this.cdr.detectChanges();

        console.log('Lâminas carregadas:', this.laminas);
        console.log('Quantidade:', this.laminas.length);
      },

      error: (erro) => {
        console.error('Erro ao carregar as lâminas:', erro);

        this.erroCarregamento = true;
        this.carregandoLaminas = false;

        this.cdr.detectChanges();
      }

    });
  }

  listarCategorias(): void {
    this.categoriasApi.listar().subscribe({

      next: (dados) => {
        this.categorias = [...dados];
        this.cdr.detectChanges();

        console.log('Categorias carregadas:', this.categorias);
      },

      error: (erro) => {
        console.error('Erro ao carregar as categorias:', erro);
      }

    });
  }

  get laminasFiltradas(): Lamina[] {
    const termo = this.termoPesquisa.trim().toLowerCase();

    return this.laminas.filter(lamina => {

      const nome = (lamina.nome || '').toLowerCase();
      const codigo = (lamina.codigo || '').toLowerCase();
      const nomeCientifico = (lamina.nome_cientifico || '').toLowerCase();
      const categoria = (lamina.categoria || '').toLowerCase();
      const descricao = (lamina.descricao || '').toLowerCase();
      const tipoMaterialBiologico =
        (lamina.tipo_material_biologico || '').toLowerCase();
      const aumentoMaximo = (lamina.aumento_maximo || '').toLowerCase();
      const oQueE = (lamina.o_que_e || '').toLowerCase();
      const funcao = (lamina.funcao || '').toLowerCase();

      const correspondePesquisa =
        nome.includes(termo) ||
        codigo.includes(termo) ||
        nomeCientifico.includes(termo) ||
        categoria.includes(termo) ||
        descricao.includes(termo) ||
        tipoMaterialBiologico.includes(termo) ||
        aumentoMaximo.includes(termo) ||
        oQueE.includes(termo) ||
        funcao.includes(termo);

      const correspondeCategoria =
        this.categoriaSelecionada === 'Todas' ||
        lamina.categoria === this.categoriaSelecionada;

      return correspondePesquisa && correspondeCategoria;
    });
  }

  aoPesquisar(termo: string): void {
    this.termoPesquisa = termo;
  }

  aoSelecionarCategoria(evento: Event): void {
    const campo = evento.target as HTMLSelectElement;
    this.categoriaSelecionada = campo.value;
  }

  abrirDetalhes(lamina: Lamina): void {
    this.laminaSelecionada = lamina;
  }

  voltarAoCatalogo(): void {
    this.laminaSelecionada = null;
  }

}