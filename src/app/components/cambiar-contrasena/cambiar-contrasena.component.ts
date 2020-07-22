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

  onResetForm() {
    this.loginForm.reset();
  }

  

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
