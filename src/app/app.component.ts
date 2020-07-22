import { Component } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front-wave';
  readonly VAPID_PUBLIC_KEY =
    'BBhlu3acwvyKzAoGjCFFmPvcjp22i275SExmGcnxNEalSaKYz5XzhpH-fZy123SUaSU1tFpXSh5Jyi-aV3Ju5as';
  constructor(private router: Router, private swPush: SwPush) {}

  ngOnInit(): void {
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log(action, notification);
      if (action === 'REDIRECT') {
        this.router.navigate(['/iniciar-sesion/foro/91']);
      }
    });
  }
}
