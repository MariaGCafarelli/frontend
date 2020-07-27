import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  categories: any;
  favoriteCategories: any;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**
     * Servicio que trae todos las Subcategorias favortias del ususario
     * en un arreglo, agrupadas por categoria
     * Inicializa el arreglo de categorias favoritas
     */
    this.waveService.getFavoriteSubCategories().subscribe((response) => {
      this.favoriteCategories = response.categories;
    });
  }

  /**
   * Funcion que usa el servicio que elimina una subcategoria a las favoritas del ususario,
   * actualiza el arreglo de categorias favoritas
   * @return void
   */
  dislikesubC(id: number) {
    this.waveService.dislikeSubcategorie(id).subscribe((res) => {
      if (res) {
        alert('Se cancelará su suscripción a los foros de la subcategoría');
        this.waveService.getFavoriteSubCategories().subscribe((response) => {
          this.favoriteCategories = response.categories;
        });
      }
    });
  }
}
