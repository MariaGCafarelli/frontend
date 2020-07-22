import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { MatAccordion } from '@angular/material/expansion';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
})
export class UsuarioComponent implements OnInit {
  user: any;
  forumsPosts: [];
  notSubscribedForumsPosts: [];
  forumsCreated: [];
  profilePick: string;
  files: File[] = [];
  userForm: FormGroup;
  panelOpenState = false;
  public payPalConfig?: IPayPalConfig;
  public total: number = 20;
  public token: string;
  private onlyletters: any= /^[ñA-Za-z _]*[ñA-Za-z][ñA-Za-z _]*$/;
  modelUser: User={
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    role:null,
    image:null,
    birthday: null,
    isActive: null


  }
  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;

  createFormGroup() {
    return new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.onlyletters) 
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.onlyletters)
        
      ]),
      userName: new FormControl('', [
        Validators.required
        
      ]),
    });
  }

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.createFormGroup();
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
    this.waveService.getCurrentUser().subscribe((response) => {
      
      this.user = response.user;
      console.log(this.user)
    });
    //console.log(this.user);
    this.waveService.getForumsPostsByUser().subscribe((res) => {
      this.forumsPosts = res.forums;
      
    });

    this.waveService.getForumCreated().subscribe((res) => {
      this.forumsCreated = res.forums;
    });

    this.waveService.getNotSubscribedByUser().subscribe((res) => {
      this.notSubscribedForumsPosts = res.forums;
    });
  }
/**
 * Recibe el id de un post verifica que este fue hecho por el usuario y lo elimina de la base de datos  
 * @param id post que el usuario desea eliminar
 */

  preUpdate(){
    this.modelUser = Object.assign({},this.user);
    
    
}
  onDelete(id: number) {
    this.waveService.DeletePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.forumsPosts = res.forums;

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });

        
      }
    });
  }

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.forumsPosts = res.forums;

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });
      }
    });
  }
/**
 * 
 * @param id 
 */
  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.forumsPosts = res.forums;

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });
      }
    });
  }
  /**
   * Condicional:
   * true: el usuario ha pagado la suscripción premium, recibe una noficación del sistema para saber que su pago fue procesado, acto siguiente el usuario pasa de ser "Normal" a "Premium"
   * false: el pago del usuario no pudo ser procesado
   * 
   */
  premiumTrue() {
    if (this.token) {
      this.waveService.becomePremium().subscribe((data) => {
        this.user = data.user;
        alert('Ahora eres usuario Premium');
        console.log;
      });
    } else {
      alert('No se proceso el pago pagado');
    }
  }

  editarPerfil(){

  }

  onSubmit(){
   
      if(this.userForm.valid){
      this.waveService.editProfile(this.modelUser.firstName, 
        this.modelUser.lastName,
        this.modelUser.userName).subscribe((res)=>{
        console.log(res);
        this.userForm.reset();
        this.user=res.user
      this.btnClose.nativeElement.click();
      })
      
    }else{
      alert("Uno o mas datos son inválidos")
    }
    
  }

  updatePic(){
    if(this.files.length>0){
     
    this.waveService.uploadPicture( this.files[0]).subscribe
    ((res)=>{
     if(res){
     console.log(res);
     this.user.image = res.imageUrl
     this.files = [];
     this.btnClose2.nativeElement.click();
  }}
  )}else{
    alert("Debe seleccionar una imagen");
  }
}

get firstName() {
  return this.userForm.get('firstName');
}

get lastName() {
  return this.userForm.get('lastName');
}

get userName() {
  return this.userForm.get('userName');
}
  ;
}
