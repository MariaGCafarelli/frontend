import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categorias-admin',
  templateUrl: './categorias-admin.component.html',
  styleUrls: ['./categorias-admin.component.scss']
})
export class CategoriasAdminComponent implements OnInit {
  categories: any;
  files: File[] = [];

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.waveService.getCategoriesWSubcategories().subscribe((response) => {
      this.categories = response.items;
      console.log('categorias', this.categories);
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

}
