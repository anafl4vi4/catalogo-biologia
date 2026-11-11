import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticacao } from '../../servicos/autenticacao';

@Component({
  selector: 'app-cabecalho-admin',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cabecalho-admin.html',
  styleUrl: './cabecalho-admin.css'
})
export class CabecalhoAdmin {
  constructor(
    private autenticacao: Autenticacao,
    private router: Router
  ) {}

  sair(): void {
    this.autenticacao.logout();
    this.router.navigate(['/login']);
  }
}