import { Component, OnInit, ViewChild } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss']
})
export class SubAdminComponent implements OnInit {
  subCategories: any[] = [];
  files: File[] = [];
  panelOpenState = false;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    this.waveService.getSubcategoriesWCategories().subscribe((response) => {
      this.subCategories = response;
      console.log('subcategorias', response);      
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