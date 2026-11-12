import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { UsuariosApi, Usuario } from '../../servicos/usuarios-api';
import { Autenticacao } from '../../servicos/autenticacao';
import { CabecalhoAdmin } from '../../componentes/cabecalho-admin/cabecalho-admin';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CabecalhoAdmin
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class Usuarios implements OnInit {

  administradores: Usuario[] = [];

  nome = '';
  email = '';
  senha = '';

  carregando = true;
  salvando = false;

  mensagemErro = '';
  mensagemSucesso = '';

  usuarioAtualId: number | null;

  constructor(
    private usuariosApi: UsuariosApi,
    private autenticacao: Autenticacao,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioAtualId =
      this.autenticacao.obterUsuario()?.id ?? null;
  }

  ngOnInit(): void {
    this.listarAdministradores();
  }

  listarAdministradores(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.usuariosApi.listar().subscribe({

      next: (usuarios) => {
        this.administradores = usuarios.filter(
          usuario => usuario.tipo === 'ADMIN'
        );

        this.carregando = false;

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao listar administradores:', erro);

        this.carregando = false;

        this.mensagemErro =
          erro.error?.mensagem ||
          'Não foi possível carregar os administradores.';

        this.cdr.detectChanges();
      }

    });
  }

  cadastrarAdministrador(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.senha
    ) {
      this.mensagemErro = 'Preencha todos os campos.';
      return;
    }

    if (this.senha.length < 8) {
      this.mensagemErro =
        'A senha precisa ter pelo menos 8 caracteres.';
      return;
    }

    this.salvando = true;

    this.usuariosApi.cadastrar({
      nome: this.nome.trim(),
      email: this.email.trim(),
      senha: this.senha,
      tipo: 'ADMIN'
    }).subscribe({

      next: () => {
        this.salvando = false;

        this.mensagemSucesso =
          'Novo administrador cadastrado com sucesso!';

        this.nome = '';
        this.email = '';
        this.senha = '';

        this.cdr.detectChanges();

        this.listarAdministradores();
      },

      error: (erro) => {
        console.error('Erro ao cadastrar administrador:', erro);

        this.salvando = false;

        this.mensagemErro =
          erro.error?.mensagem ||
          'Não foi possível cadastrar o administrador.';

        this.cdr.detectChanges();
      }

    });
  }

  excluirAdministrador(usuario: Usuario): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (usuario.id === this.usuarioAtualId) {
      this.mensagemErro =
        'Você não pode excluir sua própria conta enquanto estiver conectado.';
      return;
    }

    const confirmar = window.confirm(
      `Tem certeza de que deseja excluir o administrador ${usuario.nome}?`
    );

    if (!confirmar) {
      return;
    }

    this.usuariosApi.excluir(usuario.id).subscribe({

      next: () => {
        this.mensagemSucesso =
          'Administrador excluído com sucesso!';

        this.cdr.detectChanges();

        this.listarAdministradores();
      },

      error: (erro) => {
        console.error('Erro ao excluir administrador:', erro);

        this.mensagemErro =
          erro.error?.mensagem ||
          'Não foi possível excluir o administrador.';

        this.cdr.detectChanges();
      }

    });
  }
}