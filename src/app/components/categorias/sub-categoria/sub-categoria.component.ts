import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-sub-categoria',
  templateUrl: './sub-categoria.component.html',
  styleUrls: ['./sub-categoria.component.scss'],
})
export class SubCategoriaComponent implements OnInit {
  favoriteForums: any[] = []; //Arreglo con objetos de tipo Foro
  subscribedForums: any[] = []; //Arreglo con objetos de tipo Foro
  notSuscribedForums: any[] = []; //Arreglo con objetos de tipo Foro
  subcategory: any = {}; //Objeto de tipo subcategoria
  subcategoryId: number; //Id de la subcategoria
  filteredForums: Observable<string[]>; //Arreglo con objetos de tipo foro
  myControl = new FormControl(); //Formulario validaciones
  forumForm: FormGroup; //Formulario input
  currentPage: number = 1; //Pagina actual de la paginacion de foros no suscritos
  nextPage: boolean = false;
  comment; //Espacio en blanco para formulario
  previousUrl: string; //Ruta anterior
  currentPage2: number = 1; //Pagina actual de la paginacionde los foros suscritos
  nextPage2: boolean = false;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.forumForm = this.createFormGroup();
  }

  ngOnInit(): void {
    
    /**
     * Servicio que trae todos la subcategoria segun el id que trae la ruta,
     * inicializa el arreglo subcategory
     */
    this.subcategoryId = this.route.snapshot.params['id'];
    this.waveService
      .getSubCategoryById(this.subcategoryId)
      .subscribe((response) => {
        this.subcategory = response.subcategory;

        /**
         * Fitro del input autocomplete de foros
         */
        this.filteredForums = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );
      });

    /**
     * Servicio que trae todos los foros de la subcategoria segun el id que trae la ruta,
     * trare dos arreglos con objetos de tipo foro
     * inicializa el arreglo subscribedForums con los fotos suscritos del ususario
     * inicializa el arreglo notFavoriteForums con los fotos no favoritos
     * inicializa la paginacion de ambos foros
     */
    this.waveService
      .getFavoritesForums(
        this.subcategoryId,
        this.currentPage,
        this.currentPage2
      )
      .subscribe((response) => {
        this.subscribedForums = response.favoriteForums.items;
        this.currentPage = parseInt(response.favoriteForums.meta.currentPage);
        this.nextPage =
          this.currentPage !==
          parseInt(response.favoriteForums.meta.totalPages);

        this.notSuscribedForums = response.notFavoriteForums.items;
        this.currentPage2 = parseInt(
          response.notFavoriteForums.meta.currentPage
        );
        this.nextPage2 =
          this.currentPage2 !==
          parseInt(response.notFavoriteForums.meta.totalPages);
      });
  }

  /**
   * Funcion que inicializa el formulario y sus validaciones
   * @return Objeto Form Group inicializado
   */
  createFormGroup() {
    return new FormGroup({
      text: new FormControl('', [Validators.required]),
    });
  }

  /**
   * Funcion que borra el campo del formulario una vez cerra del componente
   * @return void
   */
  reset() {
    this.comment = '';
  }

  /**
   * Funcion que trae la ultima ruta almacenada del location de la aplicacion
   * @return void
   */
  getBack() {
    this.waveService.getPreviousUrl();
  }

  /**
   * Funcion que trae el siguiente grupo de foros segun
   * la paginación actual, actualiza el arreglo de foros suscritos y
   * las paginas
   * @return void
   */
  traerMasForos() {
    this.waveService
      .getFavoritesForums(
        this.subcategoryId,
        this.currentPage + 1,
        this.currentPage2
      )
      .subscribe((response) => {
        this.subscribedForums = this.subscribedForums.concat(
          response.favoriteForums.items
        );
        this.currentPage = parseInt(response.favoriteForums.meta.currentPage);
        this.nextPage =
          this.currentPage !==
          parseInt(response.favoriteForums.meta.totalPages);
      });
  }

  /**
   * Funcion que trae el siguiente grupo de foros segun
   * la paginación actual, actualiza el arreglo de foros no suscritos y
   * las paginas
   * @return void
   */
  traerMasForosN() {
    this.waveService
      .getFavoritesForums(
        this.subcategoryId,
        this.currentPage,
        this.currentPage2 + 1
      )
      .subscribe((response) => {
        this.notSuscribedForums = this.notSuscribedForums.concat(
          response.notFavoriteForums.items
        );
        this.currentPage2 = parseInt(
          response.notFavoriteForums.meta.currentPage
        );
        this.nextPage =
          this.currentPage !==
          parseInt(response.notFavoriteForums.meta.totalPages);
      });
  }

  /**
   * Funcion que usa el servicio para crear foros,
   * agrega el foro creado en los foros favortios del ususario y
   * redirecciona a la vista del foro
   * @param idSubcategory es el id de la subcategoria a la que pertenece el foro
   * @param title es el titulo del foro
   * @return void
   */
  crearForo(idSubcategory: number, title: string) {
    this.waveService
      .createForum(idSubcategory, title)
      .subscribe((response: any) => {
        if (response) {
          this.waveService.likeForum(response.forum.id).subscribe((res) => {
            if (res) {
              this.router.navigate([`/picture-foro/${response.forum.id}`]);
            }
          });
        } else {
          alert('El foro no pudo ser creado');
        }
      });
  }

  /**
   * Funcion que llama a crear el foro, asignando el id de la subcategoria
   * y el valor en el campo del formulario correspondiente al titulo
   * @return void
   */
  onSaveForm() {
    this.crearForo(this.subcategoryId, this.forumForm.value.text);
  }

  /**
   * Funcion que usa el servicio que agrega un foro a los favoritos del usuario,
   * actualiza los arreglos de foros favoritos y foros no suscritos
   * @return void
   */
  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.waveService
          .getFavoritesForums(
            this.subcategoryId,
            this.currentPage,
            this.currentPage2
          ) //este servicio trae favoritos y no favoritos
          .subscribe((response) => {
            this.subscribedForums = response.favoriteForums.items;
            this.currentPage = parseInt(
              response.favoriteForums.meta.currentPage
            );
            this.nextPage =
              this.currentPage !==
              parseInt(response.favoriteForums.meta.totalPages);

            this.notSuscribedForums = response.notFavoriteForums.items;
            this.currentPage2 = parseInt(
              response.notFavoriteForums.meta.currentPage
            );
            this.nextPage2 =
              this.currentPage2 !==
              parseInt(response.notFavoriteForums.meta.totalPages);
          });
      }
    });
  }

  /**
   * Funcion que usa el servicio que elimina un foro de los favoritos del usuario,
   * actualiza los arreglos de foros favoritos y foros no suscritos
   * @return void
   */
  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        this.waveService
          .getFavoritesForums(
            this.subcategoryId,
            this.currentPage,
            this.currentPage2
          ) //este servicio trae favoritos y no favoritos
          .subscribe((response) => {
            this.subscribedForums = response.favoriteForums.items;
            this.currentPage = parseInt(
              response.favoriteForums.meta.currentPage
            );
            this.nextPage =
              this.currentPage !==
              parseInt(response.favoriteForums.meta.totalPages);

            this.notSuscribedForums = response.notFavoriteForums.items;
            this.currentPage2 = parseInt(
              response.notFavoriteForums.meta.currentPage
            );
            this.nextPage2 =
              this.currentPage2 !==
              parseInt(response.notFavoriteForums.meta.totalPages);
          });
      }
    });
  }

  /**
   * Funcion que usa el servicio que agrega una subcategoria a las favoritas del ususario,
   * actualiza el objeto subcategoria
   * @return void
   */
  agregarFavorito() {
    this.waveService
      .saveFavoriteSubCategoria(this.subcategoryId)
      .subscribe((response) => console.log(response));
    this.waveService
      .getSubCategoryById(this.subcategoryId)
      .subscribe((response) => {
        this.subcategory = response.subcategory;
      });
  }

  /**
   * Funcion que almacena el contenido ingresado por el usuario en el formulario
   * @return String
   */
  get text() {
    return this.forumForm.get('text');
  }

  /**
   * Funcion filtra el string ingresado por el usuario en el input
   * @param value nombre del foro que busca el ususario
   * @return Foro
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.favoriteForums.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }
}
