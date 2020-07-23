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
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  
  /**
   * @param control
   * @param form
   * @returns boolean
   */
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
  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  public payPalConfig?: IPayPalConfig;
  public total: number = 20;
  public token: string;
  minDate: Date;
  maxDate: Date;

  //expresion regular para validar email
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  private passwordPattern: any = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]/;
  private onlyletters: any = /^[ñA-Za-z _]*[ñA-Za-z][ñA-Za-z _]*$/;

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  constructor(
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private router: Router,
    private waveService: WaveServiceService
  ) {
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDate();
    const currentMonth = new Date().getMonth();
    this.minDate = new Date(currentYear - 80, currentMonth, currentDay);
    this.maxDate = new Date(currentYear, currentMonth, currentDay);
    this.registerForm = this.formBuilder.group(
      {
        nombres: new FormControl('', [
          Validators.required,
          Validators.pattern(this.onlyletters),
        ]),
        apellidos: new FormControl('', [
          Validators.required,
          Validators.pattern(this.onlyletters),
        ]),
        fecha: new FormControl('', [Validators.required]),
        correo: new FormControl('', [
          Validators.required,
          Validators.pattern(this.emailPattern),
        ]),
        usuario: new FormControl('', [
          Validators.required,
          Validators.pattern(''),
        ]),
        contra: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(30),
          Validators.pattern(this.passwordPattern),
        ]),
        validContra: new FormControl(''),
        categorias: this.formBuilder.array([]),
        tipoCuenta: new FormControl('', Validators.required),
      },
      { validator: [this.checkPasswords] }
    );
  }

  ngOnInit(): void {
    
    /**
     * Se inicializa plugin de pago por paypal
     */
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

  /**
   * Metodo de vacia los campos del formulario
   * @returns void
   */
  onResetForm() {
    this.registerForm.reset();
  }

  /**
   * Funcion que envia los datos pertinentes al servicio para registrar un usuario nuevo
   * @returns void
   */

  onSaveForm() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.tipoCuenta == 'Premium') {
        if (this.token) {
          this.spinner.show();
          console.log(this.registerForm.value);
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
            .pipe(
              catchError((err) => {
                this.spinner.hide();
                console.log(err);
                alert(err.error.message);
                return throwError('Error thrown from catchError');
              })
            )
            .subscribe((data) => {
              console.log(data);
              this.router.navigate(['/picture']);
              this.spinner.hide();
            });
        } else {
          alert('Debe pagar primero para obtener su cuenta Premium');
        }
      } else {
        this.spinner.show();
        console.log(this.registerForm.value);
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
          .subscribe(
            (data) => {
              console.log(data);
              this.router.navigate(['/picture']);
              this.spinner.hide();
            },
            (error) => {
              alert('El usuario ya se encuentra registrado');
              this.spinner.hide();
            }
          );
      }
    } else {
      alert('Datos Erroneos');
      console.log('No Valido');
    }
  }

  /**
   * Metodo validator asincrono que devueve un error notSame en true si las contraseñas no son iguales
   * @param group
   * @returns boolean
   */

  checkPasswords(group: FormGroup) {
    let pass = group.controls.contra.value;
    let confirmPass = group.controls.validContra.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  /**
   *  getters para obtener un child control de nombres dado el nombre
   * @returns AbstractControl
   */

  get nombres() {
    return this.registerForm.get('nombres');
  }
  /**
   *  getters para obtener un child control de apellidos dado el nombre
   * @returns AbstractControl
   */

  get apellidos() {
    return this.registerForm.get('apellidos');
  }

  /**
   *  getters para obtener un child control de fecha dado el nombre
   * @returns AbstractControl
   */

  get fecha() {
    return this.registerForm.get('fecha');
  }

  /**
   *  getters para obtener un child control de usuario dado el nombre
   * @returns AbstractControl
   */

  get usuario() {
    return this.registerForm.get('usuario');
  }

  /**
   *  getters para obtener un child control de correo dado el nombre
   * @returns AbstractControl
   */
  get correo() {
    return this.registerForm.get('correo');
  }
  /**
   *  getters para obtener un child control de contra dado el nombre
   * @returns AbstractControl
   */

  get contra() {
    return this.registerForm.get('contra');
  }

  /**
   *  getters para obtener un child control de validContra dado el nombre
   * @returns AbstractControl
   */
  get validContra() {
    return this.registerForm.get('validContra');
  }

  /**
   *  getters para obtener un child control de tipoCuenta dado el nombre
   * @returns AbstractControl
   */
  get tipoCuenta() {
    return this.registerForm.get('tipoCuenta');
  }

  /**
   * Metodo que maneja el evento al seleccionar una foto y le da valor al file
   * @param file
   * @returns void
   */
  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload);
    var reader = new FileReader();
    reader.onloadend = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
  }
}
