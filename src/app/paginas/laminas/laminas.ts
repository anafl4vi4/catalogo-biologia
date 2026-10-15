
import { Component } from '@angular/core';
import { Cabeca } from '../../componentes/cabeca/cabeca';
import { Pesquisa } from '../../componentes/pesquisa/pesquisa';

interface Lamina {
  nome: string;
  categoria: string;
  descricao: string;
  aumento: string;
  material: string;
  icone: string;
}

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

  laminas: Lamina[] = [
    {
      nome: 'Tecido Epitelial',
      categoria: 'Histologia',
      descricao: 'Lâmina para observação de estruturas do tecido epitelial.',
      aumento: '400x',
      material: 'Microscópica',
      icone: '🔬'
    },
    {
      nome: 'Célula Vegetal',
      categoria: 'Botânica',
      descricao: 'Observação das principais estruturas presentes em células vegetais.',
      aumento: '400x',
      material: 'Vegetal',
      icone: '🌱'
    },
    {
      nome: 'Bactérias',
      categoria: 'Microbiologia',
      descricao: 'Lâmina destinada à observação de diferentes tipos de bactérias.',
      aumento: '1000x',
      material: 'Microbiológica',
      icone: '🦠'
    },
    {
      nome: 'Tecido Muscular',
      categoria: 'Histologia',
      descricao: 'Lâmina para estudo das características do tecido muscular.',
      aumento: '400x',
      material: 'Animal',
      icone: '🫀'
    }
  ];

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
