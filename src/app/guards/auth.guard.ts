import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { WaveServiceService } from '../services/wave-service.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Clase encargada de proteger las rutas segun el tipo de usuario,
 * si el role del usuario actual no corresponde con 'normal' o 'premium'
 * es redirigido al iniciar sesion o al panel de administrador
 */
export class AuthGuard implements CanActivate {
  constructor(private service: WaveServiceService, private rout: Router) {}
  canActivate() {
    let role = this.service.getCurrentRole();
    if (role) {
      if (role == 'normal' || role == 'premium') {
        return true;
      } else {
        this.rout.navigate(['/admin']);
        return false;
      }
    } else {
      this.rout.navigate(['/iniciar-sesion']);
      return false;
    }
  }
}
