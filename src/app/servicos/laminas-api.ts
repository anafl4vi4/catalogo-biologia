import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lamina {
  id: number;
  codigo: string;
  nome: string;
  nome_cientifico: string | null;
  categoria: string;
  tipo_material_biologico: string | null;

  descricao: string | null;
  aumento_maximo: string | null;

  o_que_e: string | null;
  funcao: string | null;

  numero_patrimonio: string | null;
  quantidade: number;

  data_cadastro: string;
  ultima_atualizacao: string;
  responsavel_cadastro_id: number | null;

  estado_conservacao: string | null;
  imagem: string | null;
  local: string | null;
  referencias_bibliograficas: string | null;
  observacoes: string | null;

  icone: string;
}

export type DadosLamina = Omit<
  Lamina,
  | 'id'
  | 'icone'
  | 'data_cadastro'
  | 'ultima_atualizacao'
  | 'responsavel_cadastro_id'
>;

@Injectable({
  providedIn: 'root'
})
export class LaminasApi {

  private apiUrl = 'http://localhost:3000/api/laminas';

  constructor(private http: HttpClient) {}

  listar(): Observable<Lamina[]> {
    return this.http.get<Lamina[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Lamina> {
    return this.http.get<Lamina>(`${this.apiUrl}/${id}`);
  }

  cadastrar(lamina: DadosLamina): Observable<any> {
    return this.http.post<any>(this.apiUrl, lamina);
  }

  atualizar(id: number, lamina: DadosLamina): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, lamina);
  }

  excluir(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}