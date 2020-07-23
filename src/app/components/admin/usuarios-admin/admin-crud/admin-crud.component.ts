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
  Admins:any[]=[]; // Arreglo de usuarios Admins
  currentPage2: number = 1; // numero de pagina
  nextPage2: boolean; // Booleado para traer más elementos

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  /**
   * Servicio que da Inicio a Variables
   * @returns void
   */
  ngOnInit(): void {
    this.waveService.getAdmins(this.currentPage2).subscribe((res)=>{
      console.log(res)
      this.Admins = res.admins.items;
       this.currentPage2 = parseInt(res.admins.meta.currentPage);
       this.nextPage2 = 
       this.currentPage2 !== parseInt(res.admins.meta.totalPages);
    })
  }

  /**
   * Función que Recibe como parametro un email y le cambia el status que tenga Activo a Inactivo o al contrario
   * @param email 
   * @returns void
   */
  estadoAdmin(email: string){
    this.waveService.statusAdmin(email).subscribe((res)=>{
      
      this.waveService.getAdmins().subscribe((res)=>{
        
        this.Admins = res.admins.items;
      })
    })
 }

 /**
  * Función que Muestra más resultados al administrador
  * @returns void
  */
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
