import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);
  categories: any[] = [];
  categoryById: any = [];
  content0: any;
  categoria: any;
  subcategories: any[] = [];
  categoryId: number;
  contentCategory = [];
  panelOpenState = false;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  previousUrl: string;
  subActive: any[] = [];

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.params['id'];
    this.waveService.getCategoryById(this.categoryId).subscribe((response) => {
      console.log(response);
      this.categoryById = response;
      if (this.categoryById.contentCategories.length > 0) {
        this.content0 = this.categoryById.contentCategories[0];
      }


        this.waveService
          .getSubcategoryByCategory(this.categoryId)
          .subscribe((response) => {
            console.log(response);
            this.subcategories = response.subCategories;
            console.log(this.subcategories);
            for(let sub of this.subcategories){
              if(sub.isActive){
                this.subActive.push(sub);
                console.log(this.subActive);
              }
            }
          });
      
    });
    this.previousUrl = this.waveService.getPreviousUrl();
  }
}
