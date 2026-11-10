
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lamina {
  id: number;
  codigo: string;
  nome: string;
  categoria: string;
  descricao: string;
  aumento: string;
  material: string;
  quantidade: number;
  estado: string;
  imagem: string;
  observacoes: string;
  icone: string;
}

@Injectable({
  providedIn: 'root'
})
export class LaminasApi {

  private apiUrl = 'http://localhost:3000/api/laminas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Lamina[]> {
    return this.http.get<Lamina[]>(this.apiUrl);
  }

  cadastrar(
    lamina: Omit<Lamina, 'id' | 'icone'>
  ): Observable<any> {
    return this.http.post<any>(this.apiUrl, lamina);
  }

  atualizar(
    id: number,
    lamina: Omit<Lamina, 'id' | 'icone'>
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lamina);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
