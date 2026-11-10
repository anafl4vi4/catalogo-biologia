
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Estrutura de uma categoria.
export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

// Resposta enviada pela API.
export interface RespostaCategoria {
  mensagem: string;
  categoria: Categoria;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriasApi {

  private apiUrl = 'http://localhost:3000/api/categorias';

  constructor(private http: HttpClient) {}

  // LISTAR TODAS AS CATEGORIAS
  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl);
  }

  // CADASTRAR UMA CATEGORIA
  cadastrar(categoria: Omit<Categoria, 'id'>): Observable<RespostaCategoria> {
    return this.http.post<RespostaCategoria>(
      this.apiUrl,
      categoria
    );
  }

  // EDITAR UMA CATEGORIA
  atualizar(
    id: number,
    categoria: Omit<Categoria, 'id'>
  ): Observable<RespostaCategoria> {
    return this.http.put<RespostaCategoria>(
      `${this.apiUrl}/${id}`,
      categoria
    );
  }

  // EXCLUIR UMA CATEGORIA
  excluir(id: number): Observable<RespostaCategoria> {
    return this.http.delete<RespostaCategoria>(
      `${this.apiUrl}/${id}`
    );
  }
}
