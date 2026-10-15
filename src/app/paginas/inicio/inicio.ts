import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cabeca } from '../../componentes/cabeca/cabeca';

@Component({
  imports: [RouterLink, Cabeca],
  selector: 'app-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class Inicio {}