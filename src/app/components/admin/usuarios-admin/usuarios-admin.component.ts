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
  users: any[] = [];

  //dataSource = ELEMENT_DATA;
  //displayedColumns: string[] = ['nombre', 'apellido', 'usuario', 'estado'];
  //dataSource = new MatTableDataSource<Usuarios>(this.users);

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.waveService.getRegularUsers().subscribe((response) => {
      this.users = response.users.items;
      console.log('categorias', this.users);
    });

  }

}




