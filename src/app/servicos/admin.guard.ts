
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacao } from './autenticacao';

export const adminGuard: CanActivateFn = () => {

  const autenticacao = inject(Autenticacao);
  const router = inject(Router);

  if (!autenticacao.estaLogado()) {
    return router.createUrlTree(['/login']);
  }

  if (!autenticacao.ehAdmin()) {
    return router.createUrlTree(['/laminas']);
  }

  return true;
};
