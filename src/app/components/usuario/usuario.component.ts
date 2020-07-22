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
  files: File[] = [];
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
      
      this.user = response.user;
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
