
import { Component } from '@angular/core';
import { Cabeca } from '../../componentes/cabeca/cabeca';
import { Pesquisa } from '../../componentes/pesquisa/pesquisa';
import { LaminasApi, Lamina } from '../../servicos/laminas-api';

@Component({
  selector: 'app-laminas',
  standalone: true,
  imports: [Cabeca, Pesquisa],
  templateUrl: './laminas.html',
  styleUrl: './laminas.css'
})
export class Laminas {
  termoPesquisa = '';
  categoriaSelecionada = 'Todas';

  laminas: Lamina[] = [];
  erroCarregamento = false;

  constructor(private laminasApi: LaminasApi) {
    this.laminasApi.listar().subscribe({
      next: (dados) => {
        this.laminas = dados;
        this.erroCarregamento = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar as lâminas da API:', erro);
        this.erroCarregamento = true;
      }
    });
  }

  get laminasFiltradas(): Lamina[] {
    const termo = this.termoPesquisa.trim().toLowerCase();

    return this.laminas.filter(lamina => {
      const correspondePesquisa =
        lamina.nome.toLowerCase().includes(termo) ||
        lamina.categoria.toLowerCase().includes(termo) ||
        lamina.descricao.toLowerCase().includes(termo);

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
}
