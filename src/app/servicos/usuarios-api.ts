
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'ADMIN' | 'ALUNO';
}

export interface DadosUsuario {
  nome: string;
  email: string;
  senha: string;
  tipo: 'ADMIN' | 'ALUNO';
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosApi {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  cadastrar(usuario: DadosUsuario): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
