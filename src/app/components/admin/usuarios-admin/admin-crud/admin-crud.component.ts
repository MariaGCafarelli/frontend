import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-crud',
  templateUrl: './admin-crud.component.html',
  styleUrls: ['./admin-crud.component.scss']
})
export class AdminCrudComponent implements OnInit { 
  Admins:any[]=[];
  currentPage2: number = 1;
nextPage2: boolean;

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.waveService.getAdmins(this.currentPage2).subscribe((res)=>{
      console.log(res)
      this.Admins = res.admins.items;
       this.currentPage2 = parseInt(res.admins.meta.currentPage);
       this.nextPage2 =
       this.currentPage2 !== parseInt(res.admins.meta.totalPages);
    })
  }

  estadoAdmin(email: string){
    this.waveService.statusAdmin(email).subscribe((res)=>{
      
      this.waveService.getAdmins().subscribe((res)=>{
        
        this.Admins = res.admins.items;
      })
    })
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
