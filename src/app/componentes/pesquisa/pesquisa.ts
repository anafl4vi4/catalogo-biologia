
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [],
  templateUrl: './pesquisa.html',
  styleUrl: './pesquisa.css'
})
export class Pesquisa {
  @Output() pesquisar = new EventEmitter<string>();

  aoPesquisar(evento: Event): void {
    const campo = evento.target as HTMLInputElement;
    this.pesquisar.emit(campo.value);
  }
}