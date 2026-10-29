
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lamina {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  aumento: string;
  material: string;
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
}
