
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Autenticacao } from './autenticacao';

export const autenticacaoInterceptor: HttpInterceptorFn = (req, next) => {

  const autenticacao = inject(Autenticacao);
  const token = autenticacao.obterToken();

  const requisicaoDaApi = req.url.startsWith(
    'http://localhost:3000/api/'
  );

  if (token && requisicaoDaApi) {
    const requisicaoComToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(requisicaoComToken);
  }

  return next(req);
};
