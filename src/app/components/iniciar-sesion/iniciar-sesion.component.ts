import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { User } from 'src/app/model/user';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.scss'],
})
export class IniciarSesionComponent implements OnInit {
  //expresion regular para validar email
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //
  user: User;

  createFormGroup() {
    return new FormGroup({
      usuario: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      contra: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
      ]),
    });
  }

  loginForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private router: Router
  ) {
    this.loginForm = this.createFormGroup();
  }

  ngOnInit() {}

  onResetForm() {
    this.loginForm.reset();
  }

  //metodo del submit que llama al del servicio pasandole el usuario y la contraseña
  onSaveForm() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.waveService.loginUser(this.loginForm.value.usuario, this.loginForm.value.contra)
      .subscribe(data=>{ 
        console.log(data);
        if((data.user.role=='normal'||data.user.role=='premium')){
        this.router.navigate(['/home']);
        this.spinner.hide();
        }if(data.user.role=='admin'){
          this.router.navigate(['/admin']);
          this.spinner.hide();
        }
      },
      
      error => {
        this.spinner.hide();
        console.log(error);
        alert(error.error.message)} 
      )  
    this.onResetForm();
    }else{
      alert('Usuario no válido, vuela a intentar');
    }
  }

  get usuario() {
    return this.loginForm.get('usuario');
  }

  get contra() {
    return this.loginForm.get('contra');
  }
}
