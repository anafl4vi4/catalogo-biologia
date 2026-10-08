import { Component } from '@angular/core';
import { Cabeca } from '../../componentes/cabeca/cabeca';

@Component({
  selector: 'app-laminas',
  standalone: true,
  imports: [Cabeca],
  templateUrl: './laminas.html',
  styleUrl: './laminas.css'
})
export class Laminas {}