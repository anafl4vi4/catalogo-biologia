
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Cabeca } from '../../componentes/cabeca/cabeca';
import { Pesquisa } from '../../componentes/pesquisa/pesquisa';

import {
  LaminasApi,
  Lamina
} from '../../servicos/laminas-api';

import {
  CategoriasApi,
  Categoria
} from '../../servicos/categorias-api';

@Component({
  selector: 'app-laminas',
  standalone: true,
  imports: [Cabeca, Pesquisa],
  templateUrl: './laminas.html',
  styleUrl: './laminas.css'
})
export class Laminas implements OnInit {

  termoPesquisa = '';
  categoriaSelecionada = 'Todas';

  laminas: Lamina[] = [];
  categorias: Categoria[] = [];

  carregandoLaminas = false;
  erroCarregamento = false;

  constructor(
    private laminasApi: LaminasApi,
    private categoriasApi: CategoriasApi,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarLaminas();
    this.listarCategorias();
  }

  // Busca as lâminas cadastradas no banco de dados.
  listarLaminas(): void {
    this.carregandoLaminas = true;
    this.erroCarregamento = false;

    this.laminasApi.listar().subscribe({
      next: (dados) => {
        this.laminas = dados;

        this.carregandoLaminas = false;
        this.erroCarregamento = false;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar as lâminas:', erro);

        this.carregandoLaminas = false;
        this.erroCarregamento = true;

        this.cdr.detectChanges();
      }
    });
  }

  // Busca as categorias cadastradas no banco de dados.
  listarCategorias(): void {
    this.categoriasApi.listar().subscribe({
      next: (dados) => {
        this.categorias = dados;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao carregar as categorias:', erro);
        this.cdr.detectChanges();
      }
    });
  }

  // Filtra as lâminas pela pesquisa e pela categoria selecionada.
  get laminasFiltradas(): Lamina[] {
    const termo = this.termoPesquisa.trim().toLowerCase();

    return this.laminas.filter(lamina => {

      const nome = (lamina.nome || '').toLowerCase();
      const categoria = (lamina.categoria || '').toLowerCase();
      const descricao = (lamina.descricao || '').toLowerCase();

      const correspondePesquisa =
        nome.includes(termo) ||
        categoria.includes(termo) ||
        descricao.includes(termo);

      const correspondeCategoria =
        this.categoriaSelecionada === 'Todas' ||
        lamina.categoria === this.categoriaSelecionada;

      return correspondePesquisa && correspondeCategoria;
    });
  }

  // Recebe o texto digitado no componente de pesquisa.
  aoPesquisar(termo: string): void {
    this.termoPesquisa = termo;
  }

  // Atualiza a categoria selecionada no filtro.
  aoSelecionarCategoria(evento: Event): void {
    const campo = evento.target as HTMLSelectElement;

    this.categoriaSelecionada = campo.value;
  }
}
