
import { Routes } from '@angular/router';

import { Laminas } from './paginas/laminas/laminas';
import { Inicio } from './paginas/inicio/inicio';
import { Categorias } from './paginas/categorias/categorias';
import { Sobre } from './paginas/sobre/sobre';
import { Login } from './paginas/login/login';
import { Admin } from './paginas/admin/admin';
import { Usuarios } from './paginas/usuarios/usuarios';
import { AdminLaminas } from './paginas/admin-laminas/admin-laminas';
import { AdminCategorias } from './paginas/admin-categorias/admin-categorias';

import { adminGuard } from './servicos/admin.guard';

export const routes: Routes = [
  // Páginas públicas
  { path: '', component: Inicio },
  { path: 'laminas', component: Laminas },
  { path: 'categorias', component: Categorias },
  { path: 'sobre', component: Sobre },

  // Login administrativo
  { path: 'login', component: Login },

  // Painel administrativo
  {
    path: 'admin',
    component: Admin,
    canActivate: [adminGuard]
  },

  // Gerenciamento de lâminas
  {
    path: 'admin/laminas',
    component: AdminLaminas,
    canActivate: [adminGuard]
  },

  // Gerenciamento de categorias
  {
    path: 'admin/categorias',
    component: AdminCategorias,
    canActivate: [adminGuard]
  },

  // Gerenciamento de administradores
  {
    path: 'usuarios',
    component: Usuarios,
    canActivate: [adminGuard]
  },

  // Redirecionamento do endereço antigo
  {
    path: 'cadastro',
    redirectTo: 'admin/laminas',
    pathMatch: 'full'
  },

  { path: '**', redirectTo: '' }
];
