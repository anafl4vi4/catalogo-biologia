
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticacao } from '../../servicos/autenticacao';
import { CabecalhoAdmin } from '../../componentes/cabecalho-admin/cabecalho-admin';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, CabecalhoAdmin],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin {
  constructor(
    private autenticacao: Autenticacao,
    private router: Router
  ) {}

  sair(): void {
    this.autenticacao.logout();
    this.router.navigate(['/']);
  }
}
