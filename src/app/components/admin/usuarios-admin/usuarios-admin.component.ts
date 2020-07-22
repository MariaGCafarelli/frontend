import { Component, OnInit} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.component.html',
  styleUrls: ['./usuarios-admin.component.scss']
})

export class UsuariosAdminComponent implements OnInit {

users:any[] = []; 
currentPage: number = 1;
nextPage: boolean;


  constructor(private waveService: WaveServiceService) { }

  ngOnInit(): void {
     this.waveService.getNormalUsers(this.currentPage).subscribe((res)=>{
       this.users = res.users.items;
       console.log(this.users);
       this.currentPage = parseInt(res.users.meta.currentPage);
       this.nextPage =
       this.currentPage !== parseInt(res.users.meta.totalPages);
     })

     
  }



 estadoUser(email: string){
  this.waveService.statusNormal(email).subscribe((res)=>{
    console.log(res);
    this.waveService.getNormalUsers().subscribe((res)=>{
      console.log(res)
      this.users = res.users.items;
    })
  })
}

traerMasUsers() {
  this.waveService
    .getNormalUsers(this.currentPage + 1)
    .subscribe((response) => {
      this.users = this.users.concat(response.users.items);
      this.currentPage = parseInt(response.users.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.users.meta.totalPages);
      
    });
}



}




