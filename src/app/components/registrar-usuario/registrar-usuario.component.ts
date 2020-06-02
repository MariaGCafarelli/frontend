import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
  FormBuilder,
  FormArray,
  RequiredValidator,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';






export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.scss'],
})
export class RegistrarUsuarioComponent implements OnInit {
  imageUrl: string = '../../../assets/icon/usuario.png';
  fileToUpload: File = null;

  public payPalConfig?: IPayPalConfig;
  public total: number = 20;
  public token: string;

  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  registerForm: FormGroup;

  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private waveService: WaveServiceService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        nombres: new FormControl('', [Validators.required]),
        apellidos: new FormControl('', [Validators.required]),
        fecha: new FormControl('', [Validators.required]),
        correo: new FormControl('', [
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
        usuario: new FormControl('', [
          Validators.required,
          Validators.pattern(''),
        ]),
        image: new FormControl(''),
        contra: new FormControl('', [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(10),
        ]),
        validContra: new FormControl(''),
        categorias: this.formBuilder.array([]),
        tipoCuenta: new FormControl('', Validators.required)
      },
      { validator: [this.checkPasswords] }
    );
  }

  ngOnInit(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: `${this.total}`,
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: `${this.total}`,
                  },
                },
              },
              items: [
                {
                  name: 'Premium',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: '20',
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction was approved, but not authorized',
          data,
          actions
        );
        actions.order.get().then((details) => {
          console.log(
            'onApprove - you can get full order details inside onApprove: ',
            details
          );
        });
      },
      onClientAuthorization: (data) => {
        console.log(
          'onClientAuthorization - you should probably inform your server about completed transaction at this point',
          data
        );
        this.token = data.id;
        alert('Reservacion realizada con exito, su localizador es: ' + data.id);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };

    
  }

  agregarCategoria() {
    const categoriaFormGroup = this.formBuilder.group({
      Categoria: '',
    });
    this.categorias.push(categoriaFormGroup);
  }

  removerCategoria(indice) {
    this.categorias.removeAt(indice);
  }

  onResetForm() {
    this.registerForm.reset();
  }
  

  onSaveForm() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      if (this.registerForm.value.tipoCuenta == 'Premium') {
        if (this.token) {
          this.waveService
            .registerUser(
              this.registerForm.value.nombres,
              this.registerForm.value.apellidos,
              this.registerForm.value.usuario,
              this.registerForm.value.correo,
              this.registerForm.value.fecha,
              this.registerForm.value.contra,
              this.registerForm.value.tipoCuenta
            )
            .subscribe((data) => {
              console.log(data);
              this.router.navigate(['/home']);
            });
        } else {
          alert('Debe pagar primero para obtener su cuenta Premium');
        }
      } else {
        this.waveService
          .registerUser(
            this.registerForm.value.nombres,
              this.registerForm.value.apellidos,
              this.registerForm.value.usuario,
              this.registerForm.value.correo,
              this.registerForm.value.fecha,
              this.registerForm.value.contra,
              this.registerForm.value.tipoCuenta
          )
          .subscribe((data) => {
            console.log(data);
            this.router.navigate(['/home']);
          });
      }
    } else {
      alert('Datos Erroneos');
      console.log('No Valido');
    }
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.contra.value;
    let confirmPass = group.controls.validContra.value;

    return pass === confirmPass ? null : { notSame: true };
  }


  get nombres() {
    return this.registerForm.get('nombres');
  }

  get apellidos() {
    return this.registerForm.get('apellidos');
  }

  get fecha() {
    return this.registerForm.get('fecha');
  }

  get usuario() {
    return this.registerForm.get('usuario');
  }

  get correo() {
    return this.registerForm.get('correo');
  }

  get contra() {
    return this.registerForm.get('contra');
  }

  get validContra() {
    return this.registerForm.get('validContra');
  }

  get categorias() {
    return this.registerForm.get('categorias') as FormArray;
  }

  get tipoCuenta() {
    return this.registerForm.get('tipoCuenta');
  }

  

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }
}
