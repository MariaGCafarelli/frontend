import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
} from '@angular/router';
import { WaveServiceService } from '../services/wave-service.service';

@Injectable({
  providedIn: 'root',
})

/**
 * Clase encargada de proteger las rutas segun el tipo de usuario administrador,
 * si el role del usuario actual no corresponde con 'admin' o 'superadmin'
 * es redirigido al iniciar sesion o al home de usuario
 */
export class AdminGuard implements CanActivate {
  constructor(private service: WaveServiceService, private rout: Router) {}
  canActivate() {
    let role = this.service.getCurrentRole();
    if (role) {
      if (role == 'admin' || role == 'superadmin') {
        return true;
      } else {
        this.rout.navigate(['/home']);
        return false;
      }
    } else {
      this.rout.navigate(['/iniciar-sesion']);
      return false;
    }
  }
}
