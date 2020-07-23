import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
})
export class CategoriasComponent implements OnInit {
  categories: any[] = []; //Arreglo con todas las categorias
  currentPage: number = 1; //Paginacion actual
  nextPage: boolean = false; //Siguiente pagina
  previousUrl: string; //Ruta anterior
  favoriteCategories: any[] = []; //Arreglo con categorias favoritas del usuario

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**
     * Servicio que trae todos las categorias y todas las subcategorias
     * asociadas a ella paginadas, inicializa el arreglo de categorias
     * la pagina actual y la siguiente
     */
    this.waveService.getCategoriesWSubcategories().subscribe((response) => {
      this.categories = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);

      /**
       * Servicio que trae todos las Subcategorias favortias del ususario
       * en un arreglo, agrupadas por categoria
       * Inicializa el arreglo de categorias favoritas
       */
      this.waveService.getFavoriteSubCategories().subscribe((response) => {
        this.favoriteCategories = response.categories;
      });
    });
  }

  /**
   * Funcion que trae la ultima ruta almacenada del location de la aplicacion
   * @return void
   */
  getBack() {
    this.waveService.getPreviousUrl();
  }

  /**
   * Funcion que trae el siguiente grupo de categorias segun
   * la paginación actual, actualiza el arreglo de categorias
   * @return void
   */
  traerMasCategorias() {
    this.waveService
      .getCategoriesWSubcategories(this.currentPage + 1)
      .subscribe((response) => {
        this.categories = this.categories.concat(response.items);
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  /**
   * Funcion que usa el servicio para agregar
   * subcategoria favorita, y actualiza el arreglo de
   * categorias favortias con la informacion nueva
   * @param subcategoriaId que es el id de la subcategoria a agregar
   * @return void
   */
  agregarFavorito(subcategoriaId) {
    this.waveService
      .saveFavoriteSubCategoria(subcategoriaId)
      .subscribe((response) => {
        if (response) {
          this.waveService.getFavoriteSubCategories().subscribe((response) => {
            this.favoriteCategories = response.categories;
          });
        }
      });
  }

  /**
   * Funcion que recorre el arreglo de categorias favortias
   * y verifica si el id de la subcategoria pertene al arreglo
   * @param idSub es el id de la subcategoria
   * @param idCat es el id de la categoria de la subcategoria
   * @return true si la subcategoria es favorita del usuario, false de lo contrario
   */
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
