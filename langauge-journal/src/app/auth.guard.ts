import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { LAYOUT_ROUTS } from './layout/layoutRoutes';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  const router: Router = inject(Router);
  let isLoggedIn: boolean;

  authService.isLoggedInState.subscribe((value) => {
    isLoggedIn = value;
  });

  return isLoggedIn;
};
