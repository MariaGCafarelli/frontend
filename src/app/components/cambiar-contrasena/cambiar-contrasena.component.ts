import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms'
import { WaveServiceService } from 'src/app/services/wave-service.service';
import {ActivatedRoute, Route, Router} from '@angular/router';


@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.scss']
})
export class CambiarContrasenaComponent implements OnInit {
  private   Pattern: any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/;
  //
  user: any; 
  token: string;

  loginForm: FormGroup;
/**
 * Revisa si las contraseñas colocadas en el formulario son iguales para la sustitución de la Contraseña anterior
 * @param group formulario donde el usuario coloca un Nuevo Password y la Confirmación de este
 * @returns si es false procede, en caso contrario mostrará un mensaje de error
 */
  checkPasswords(group: FormGroup) {
    let pass = group.controls.contra.value;
    let confirmPass = group.controls.contraconf.value;

    return pass === confirmPass ? null : { notSame: true };
  }


  constructor(private router: Router, private route: ActivatedRoute ,private waveService: WaveServiceService, private formBuilder: FormBuilder,) { 
    this.loginForm = this.formBuilder.group(
      {
       
        contra: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(this.Pattern)
        ]),
        contraconf: new FormControl(''),
      },
      { validator: [this.checkPasswords] }
    );
  }


  ngOnInit() {
    this.token= this.route.snapshot.queryParamMap.get('token');
  
  }
/**
 * limpia el form de los valores colcoados anteriormente
 */
  onResetForm() {
    this.loginForm.reset();
  }

  /**
   * Una vez que sea se compruebe que la contraseña cumple con la longitud adecuada y que password sea igual a confirmPassword se procede a cambiarle la contraseña al usuario, cumplido se envia al usuario a la ruta de iniciar-sesion y le sera mostrado un aviso que el cambio fue hecho con exito
   *  
   * 
   */

  onSaveForm(){
   if(this.loginForm.valid){
     this.waveService.resetPassword(this.token , this.loginForm.value.contra).subscribe((res)=>{
       alert("Cambiado con exito");
       this.loginForm.reset();
       this.router.navigate(['/iniciar-sesion']);
     }
     
     )
   }
  }

  get contra(){
    return this.loginForm.get('contra')
  };

  get contraconf(){
    return this.loginForm.get('contraconf')
  };

}
