
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Autenticacao } from '../../servicos/autenticacao';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  mensagemErro = '';
  carregando = false;

  constructor(
    private autenticacao: Autenticacao,
    private router: Router
  ) {}

  entrar(): void {
    this.mensagemErro = '';

    if (!this.email.trim() || !this.senha) {
      this.mensagemErro = 'Preencha o e-mail e a senha.';
      return;
    }

    this.carregando = true;

    this.autenticacao.login(this.email, this.senha).subscribe({
      next: (resposta) => {
        this.carregando = false;

        if (resposta.usuario.tipo !== 'ADMIN') {
          this.autenticacao.logout();
          this.mensagemErro =
            'Esta área é exclusiva para administradores.';
          return;
        }

        this.router.navigate(['/admin']);
      },

      error: (erro) => {
        this.carregando = false;
        this.mensagemErro =
          erro.error?.mensagem ||
          'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }
}
