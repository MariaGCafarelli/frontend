import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
})
export class IniciarSesionComponent implements OnInit {
  // Expresion regular para validar email
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  user: User; // Usuario a iniciar sesion
  loginForm: FormGroup; // Formulario

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private router: Router
  ) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit() {}

  /**
   * Metodo que vacia los campos del formulario
   * @returns void
   */
  onResetForm() {
    this.loginForm.reset();
  }

  /**
   * Metodo que manda los datos requeridos para el auth segun informacion
   * ingresada en formulario
   * @returns void
   */
  onSaveForm() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.waveService
        .loginUser(this.loginForm.value.usuario, this.loginForm.value.contra)
        .pipe(
          catchError((err) => {
            this.spinner.hide();
            alert(err.error.message);
            return throwError('Error thrown from catchError');
          })
        )

        .subscribe(
          (data) => {
            if (data.user.role == 'normal' || data.user.role == 'premium') {
              this.router.navigate(['/home']);
              this.spinner.hide();
            }
            if (data.user.role == 'admin' || data.user.role == 'superadmin') {
              this.router.navigate(['/admin']);
              this.spinner.hide();
            }
          },
          (error) => {
            this.spinner.hide();
            alert(error.error.message);
          }
        );
      this.onResetForm();
    } else {
      alert('Usuario no válido, vuela a intentar');
    }
  }

  /**
   * Metodo que da formato al form group nombrando sus form controls y
   *  las validaciones a las que se someten
   * @returns void
   */

  createFormGroup() {
    return new FormGroup({
      usuario: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      contra: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
      ]),
    });
  }

  /**
   *  Funcion que almacena un child control de usuario dado el nombre
   * @returns String
   */

  get usuario() {
    return this.loginForm.get('usuario');
  }

  /**
   *  getters para obtener un child control de contra dado el nombre
   * @returns String
   */

  get contra() {
    return this.loginForm.get('contra');
  }
}
