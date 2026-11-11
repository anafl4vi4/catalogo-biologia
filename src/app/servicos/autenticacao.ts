
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'ALUNO';
}

export interface RespostaLogin {
  mensagem: string;
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class Autenticacao {

  private apiUrl = 'http://localhost:3000/api/auth';

  private usuarioSubject = new BehaviorSubject<Usuario | null>(
    this.obterUsuarioSalvo()
  );

  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    // Remove sessões antigas que estavam salvas permanentemente.
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  private obterUsuarioSalvo(): Usuario | null {
    const usuarioSalvo = sessionStorage.getItem('usuario');

    if (!usuarioSalvo) {
      return null;
    }

    try {
      return JSON.parse(usuarioSalvo) as Usuario;
    } catch {
      sessionStorage.removeItem('usuario');
      sessionStorage.removeItem('token');
      return null;
    }
  }

  login(email: string, senha: string): Observable<RespostaLogin> {
    return this.http.post<RespostaLogin>(
      `${this.apiUrl}/login`,
      { email, senha }
    ).pipe(
      tap(resposta => {
        sessionStorage.setItem('token', resposta.token);
        sessionStorage.setItem(
          'usuario',
          JSON.stringify(resposta.usuario)
        );

        this.usuarioSubject.next(resposta.usuario);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.usuarioSubject.next(null);
  }

  obterToken(): string | null {
    return sessionStorage.getItem('token');
  }

  obterUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  estaLogado(): boolean {
    return !!this.obterToken();
  }

  ehAdmin(): boolean {
    return this.obterUsuario()?.tipo === 'ADMIN';
  }
}
