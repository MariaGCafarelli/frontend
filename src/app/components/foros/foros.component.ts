import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-foros',
  templateUrl: './foros.component.html',
  styleUrls: ['./foros.component.scss'],
})
export class ForosComponent implements OnInit {
  forums: any[] = []; //Arreglo con objetos de tipo Foro
  filteredForums: Observable<string[]>; //Arreglo con objetos de tipo foro filtrados
  filterForum = ''; //Espacio en blanco para input
  myControl = new FormControl(); //Formulario validaciones
  currentPage: number = 1; //Pagina actual de la paginacion de foros
  nextPage: boolean = false;
  myforums: any; //Arreglo con objetos de tipo foro suscritos del ususario
  notMyforums: any[] = []; //Arreglo con ojetos de tipo foros no suscritos del ususario
  previousUrl: string; //Ruta anterior
  categories: any[]; //Arreglo con objetos de tipo categoria
  subcategories: any[]; //Arreglo con objetos de tipo subcateforia
  selectedIdCategory: number; //Id de la categoria en select
  selectedIdSubcategory: number; //Id de la subcategoria en select
  searchTermText: string; //String del input de usuario
  searchText: string;
  searchTextModelChanged: Subject<string> = new Subject<string>();
  searchTextModelChangeSubscription: Subscription;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    /**
     * Servicio que trae todos los foros paginados, inicializa
     * arreglo forums con el resultado de la busqueda
     */
    this.searchTextModelChangeSubscription = this.searchTextModelChanged
      .pipe(debounceTime(350), distinctUntilChanged())
      .subscribe((newText) => {
        this.searchTermText = newText;
        this.waveService
          .getAllForums({
            selectedIdCategory: this.selectedIdCategory,
            selectedIdSubcategory: this.selectedIdSubcategory,
            searchTerm: this.searchTermText,
          })
          .subscribe(
            (response) => {
              this.forums = response.items;
              this.currentPage = parseInt(response.meta.currentPage);
              this.nextPage =
                this.currentPage !== parseInt(response.meta.totalPages);
            },
            (err) => console.log(err)
          );
      });

    /**
     * Servicio que trae todos los foros, inicializa
     * arreglo myforums con los foros y su paginacion
     */
    this.waveService.getAllForums({}).subscribe((response) => {
      this.forums = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      this.waveService.getForumsPostsByUser().subscribe((res) => {
        this.myforums = res.forums;
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
   * Funcion que actualiza arreglos de foros, subcategorias y categorias
   * segun el texto ingresado por el ususario
   * @return void
   */
  onChangeCategory(target) {
    this.selectedIdCategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        this.forums = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
    this.waveService
      .getSubcategoryByCategory(this.selectedIdCategory)
      .subscribe((response) => {
        this.subcategories = response.subCategories;
      });
  }

  /**
   * Funcion que actualiza arreglos de foros y subcategorias
   * segun el texto ingresado por el ususario
   * @return void
   */
  onChangeSubcategory(target) {
    this.selectedIdSubcategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        selectedIdSubcategory: this.selectedIdSubcategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        this.forums = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  /**
   * Funcion que trae el siguiente grupo de foros segun
   * la paginación actual, actualiza el arreglo de forums y
   * las paginas
   * @return void
   */
  traerMasForos() {
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        selectedIdSubcategory: this.selectedIdSubcategory,
        searchTerm: this.filterForum,
        currentPage: this.currentPage + 1,
      })
      .subscribe((response) => {
        this.forums = this.forums.concat(response.items);
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

  /**
   * Funcion que usa el servicio que agrega un foro a los favoritos del usuario,
   * actualiza los arreglos de foros favoritos
   * @param id id del foro
   * @return void
   */
  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
        });
      }
    });
  }

  /**
   * Funcion que usa el servicio que agrega un foro a los no favoritos del usuario,
   * actualiza los arreglos de foros favoritos
   * @param id id del foro
   * @return void
   */
  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
        });
      }
    });
  }

  /**
   * Funcion que recorre el arreglo de foros faritos del ususario y verifica
   * si el id seleccionado pertenece al arreglo
   * @param id id del foro
   * @return true si el foro es favoriro, false de lo contrario
   */
  isFav(id: number) {
    let vart;
    if (this.myforums) {
      vart = this.myforums.find((ob) => ob.id == id);
      if (vart == null) {
        return false;
      }
      return true;
    }
  }
}
