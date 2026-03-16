import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  let auth = inject(AuthService);
  let router = inject(Router);
  if (!auth.estaAutenticado()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
