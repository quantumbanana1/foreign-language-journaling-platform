import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { LoggedinService } from './loggedin.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(LoggedinService);
  const router: Router = inject(Router);
  let isLoggedIn: boolean;
  authService.authorized$.next();
  authService.isLoggedIn$.subscribe((status) => {
    console.log(status);
    if (status === 'authenticated') {
      isLoggedIn = true;
      return true;
    } else {
      isLoggedIn = false;
      return false;
    }
  });

  return isLoggedIn;
};
