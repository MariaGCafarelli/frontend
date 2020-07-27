import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
  categoryId: number; //Id de la categoria
  categoryById: any = []; //Arreglo con el objeto de tipo Categoria
  subcategories: any[] = []; //Arreglo con objetos de tipo Subcategoria
  panelOpenState = false; //Estados del panel de contenido
  previousUrl: string; //Ruta anterior
  subActive: any[] = []; //Arreglo con objetos de tipo subcategoria

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**
     * Servicio que trae todos la categoria segun el id que trae la ruta,
     * inicializa el arreglo categoryById
     * la pagina actual y la siguiente
     */
    this.categoryId = this.route.snapshot.params['id'];
    this.waveService.getCategoryById(this.categoryId).subscribe((response) => {
      this.categoryById = response;
    });

    /**
     * Servicio que trae todos las subcategorias segun el id de categoria
     * que trae la ruta, inicializa el arreglo subActive con las subcategorias
     * activas
     */
    this.waveService
      .getSubcategoryByCategory(this.categoryId)
      .subscribe((response) => {
        this.subcategories = response.subCategories;
        for (let sub of this.subcategories) {
          if (sub.isActive) {
            this.subActive.push(sub);
          }
        }
      });
  }

  /**
   * Funcion que trae la ultima ruta almacenada del location de la aplicacion
   * @return void
   */
  getBack() {
    this.waveService.getPreviousUrl();
  }
}
