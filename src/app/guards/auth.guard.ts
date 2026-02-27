import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let auth = inject(AuthService);
  let router = inject(Router);
console.log("Entro en guard")
  if (!auth.estaAutenticado()){
    console.log("no autenticado")
    router.navigateByUrl("/login")
    return false;
  }
  console.log("si autenticado")

  return true;
};
