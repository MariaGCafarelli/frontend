import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: any;

  constructor(private service: WaveServiceService) { }

  ngOnInit(): void {
    this.service.getCurrentUser().subscribe((response) => {
      console.log(response);
      this.user = response.user;
    });
  }

  logOut(){
    this.service.logOutUser();

  }

}
