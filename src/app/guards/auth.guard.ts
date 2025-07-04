import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs'; // 'of' ya no es necesario si no lo usas para Observables síncronos

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const currentUserLoggedIn = this.authService.userLoggedIn(); // Esto ya es un boolean
    const userRole = this.authService.userRole(); // Esto puede ser string | null
    const requiredRoles = route.data['roles'] as string[];

    // Primero, verificamos si el usuario está logueado
    if (!currentUserLoggedIn) {
      console.warn('Acceso denegado: No hay usuario logueado.');
      return this.router.createUrlTree(['/loginregister']);
    }

    // Luego, verificamos si el rol del usuario existe.
    // Si currentUserLoggedIn es true, pero userRole es null (lo cual no debería pasar si el login es correcto)
    // o si el rol es una cadena vacía (lo cual podrías considerar inválido)
    if (userRole === null || userRole.trim() === '') { // Usamos .trim() para considerar cadenas vacías inválidas también
      console.warn('Acceso denegado: El usuario logueado no tiene un rol válido asignado.');
      return this.router.createUrlTree(['/loginregister']); // O a una página de error/acceso denegado
    }

    // Si la ruta no especifica roles requeridos, permitimos el acceso (solo se necesita estar logueado)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // En este punto, sabemos que userRole es un string (no null ni vacío)
    if (requiredRoles.includes(userRole)) {
      return true; // El usuario tiene el rol necesario, permitir el acceso
    } else {
      console.warn(`Acceso denegado: El usuario con rol '${userRole}' no tiene permiso para acceder a esta ruta. Roles requeridos: ${requiredRoles.join(', ')}`);
      return this.router.createUrlTree(['/access-denied']);
    }
    
  }
}