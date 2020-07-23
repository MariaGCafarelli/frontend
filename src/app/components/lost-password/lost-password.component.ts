import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss']
})
export class LostPasswordComponent implements OnInit {

  private   emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // Validador
  
/**
 *  Funcion que otorga formato al formgroup, asigna nombre a sus campos y las validaciones pertinentes
 */
  createFormGroup (){
    return new FormGroup({
    usuario: new FormControl('', [
      Validators.required,
      Validators.pattern(this.emailPattern)  
    ])
    })
  }

  /**
   * Formulario
   */
  loginForm: FormGroup;


  constructor(private waveService: WaveServiceService, private router: Router) { 
    this.loginForm = this.createFormGroup();
  }

  /**
   * Servicio de inicio
   */
  ngOnInit() {
  
  }

 /**
  * Funcion que envia Correo al usuario para cambiar la contraseña olvidada, notifica cuando este enviado, y redirecciona al usuario a la pagina de inicio
  * @returns void
  */
  onSaveForm(){
    this.waveService.generateLink(this.loginForm.value.usuario).subscribe((res)=>{
      alert(res.message);
      this.loginForm.reset();
      this.router.navigate(['/']);
    })
  }

  /**
   * Función que trae el Usuario
   * @returns void
   */
  get usuario(){
    return this.loginForm.get('usuario')
  };


 

}
