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
Admins:any[]=[];
users:any[] = []; 
currentPage: number = 1;
nextPage: boolean;
currentPage2: number = 1;
nextPage2: boolean;

  constructor(private waveService: WaveServiceService) { }

  ngOnInit(): void {
     this.waveService.getNormalUsers(this.currentPage).subscribe((res)=>{
       this.users = res.users.items;
       console.log(this.users);
       this.currentPage = parseInt(res.users.meta.currentPage);
       this.nextPage =
       this.currentPage !== parseInt(res.users.meta.totalPages);
     })

     this.waveService.getAdmins(this.currentPage2).subscribe((res)=>{
      console.log(res)
      this.Admins = res.admins.items;
      console.log(this.users);
       this.currentPage2 = parseInt(res.admins.meta.currentPage);
       this.nextPage2 =
       this.currentPage2 !== parseInt(res.admins.meta.totalPages);
    })
  }

 estadoAdmin(email: string){
    this.waveService.statusAdmin(email).subscribe((res)=>{
      console.log(res);
      this.waveService.getAdmins().subscribe((res)=>{
        console.log(res)
        this.Admins = res;
      })
    })
 }

 estadoUser(email: string){
  this.waveService.statusNormal(email).subscribe((res)=>{
    console.log(res);
    this.waveService.getNormalUsers(this.currentPage).subscribe((res)=>{
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

traerMasAdmins() {
  this.waveService
    .getAdmins(this.currentPage2 + 1)
    .subscribe((response) => {
      this.Admins = this.Admins.concat(response.admins.items);
      this.currentPage2 = parseInt(response.admins.meta.currentPage);
      this.nextPage2 = this.currentPage2 !== parseInt(response.admins.meta.totalPages);
      
    });
}

}




