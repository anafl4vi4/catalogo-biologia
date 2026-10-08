import { Routes } from '@angular/router';
import { Laminas } from './paginas/laminas/laminas';
import { Inicio } from './paginas/inicio/inicio';
import { Categorias } from './paginas/categorias/categorias';
import { Sobre } from './paginas/sobre/sobre';

export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  {
    path: 'laminas',
    component: Laminas
  },
  {
    path: 'categorias',
    component: Categorias
  },
  {
    path: 'sobre',
    component: Sobre
  }
]