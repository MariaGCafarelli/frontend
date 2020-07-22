import { Component, OnInit, ViewChild } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { MatAccordion } from '@angular/material/expansion';

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
  panelOpenState = false;
  public payPalConfig?: IPayPalConfig;
  public total: number = 20;
  public token: string;

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
      console.log(response);
      this.user = response.user;
    });
    //console.log(this.user);
    this.waveService.getForumsPostsByUser().subscribe((res) => {
      this.forumsPosts = res.forums;
      console.log(this.forumsPosts);
    });

    this.waveService.getForumCreated().subscribe((res) => {
      this.forumsCreated = res.forums;
      console.log('foros creados', this.forumsCreated);
    });

    this.waveService.getNotSubscribedByUser().subscribe((res) => {
      this.notSubscribedForumsPosts = res.forums;
    });
  }
/**
 * 
 * @param id 
 */
  onDelete(id: number) {
    this.waveService.DeletePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.forumsPosts = res.forums;
          console.log(this.forumsPosts);

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });

        console.log(res);
      }
    });
  }
/**
 * Recibe un id de un foro que el usuario desee estar suscrito para recibir y compartir información sobre este
 * @param id id del foro que desea estar suscrito
 */
  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.forumsPosts = res.forums;
          console.log(this.forumsPosts);

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });
        console.log(res);
        alert('¡Ahora estás suscrito en el foro!');
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
          console.log(this.forumsPosts);

          this.waveService.getNotSubscribedByUser().subscribe((res) => {
            this.notSubscribedForumsPosts = res.forums;
          });
        });
        alert('Dejarás de estar suscrito al foro');
        // console.log(res);
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
}
