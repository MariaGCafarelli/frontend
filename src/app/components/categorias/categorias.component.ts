import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  categories: any[] = [];
  currentPage: number = 1;
  nextPage: boolean = false;
  previousUrl: string;
  favoriteCategories: any;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.waveService.getCategoriesWSubcategories().subscribe((response) => {
      this.categories = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);

      this.waveService.getFavoriteSubCategories().subscribe((response) => {
        console.log(response);
        this.favoriteCategories = response.categories;
      });
    });

    this.previousUrl = this.waveService.getPreviousUrl();
  }

  traerMasCategorias() {
    this.waveService
      .getCategoriesWSubcategories(this.currentPage + 1)
      .subscribe((response) => {
        this.categories = this.categories.concat(response.items);
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  agregarFavorito(category, subcategoriaId) {
    console.log(subcategoriaId);
    this.waveService
      .saveFavoriteSubCategoria(subcategoriaId)
      .subscribe((response) => {
        if (response) {
          this.waveService.getFavoriteSubCategories().subscribe((response) => {
            console.log(response);
            this.favoriteCategories = response.categories;
            console.log('favorite', this.favoriteCategories);
          });
          console.log(response);
        }
      });
  }

  isFav(idCat: number, idSub: number) {
    if (this.favoriteCategories) {
      for (let entry of this.favoriteCategories) {
        if (entry.id == idCat) {
          for (let sub of entry.subCategories) {
            if (sub.id == idSub) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
