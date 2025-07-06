import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const notAuthGuard: CanActivateFn = (route, state) => {
  const loginservice = inject(LoginService);
  const router = inject(Router);

  const currentUserLoggedIn = loginservice.userLoggedIn();
  if (currentUserLoggedIn) {
    // If user is logged in, redirect to home
    router.navigate(['']);
    return false;
  }
  return true;
};
