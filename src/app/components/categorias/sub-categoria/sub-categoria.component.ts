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
  subcategories: any[] = [];
  favoriteForums: any[] = [];
  subscribedForums: any[] = [];
  subcategory: any = {};
  subcategoryId: number;
  categoryId: number;
  filteredForums: Observable<string[]>;
  myControl = new FormControl();
  fileToUpload = null;
  imageUrl = null;
  file: any;
  favorite = true;
  CatWFavoriteSubcat: any[] = [];
  forums: any;
  forumForm: FormGroup;
  subcaregoryContent: any = {};
  currentPage: number = 1;
  nextPage: boolean = false;
  comment;
  previousUrl: string;
  forumActive: any[] = [];
  notSuscribedForums: any[] = [];
  currentPage2: number = 1;
  nextPage2: boolean = false;

  createFormGroup() {
    return new FormGroup({
      text: new FormControl('', [Validators.required]),
    });
  }

  handleFileInput(file: FileList) {
    console.log(file);
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload);

    var reader = new FileReader();
    reader.onloadend = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    console.log(reader.result);
  }
  reset() {
    this.comment = '';
  }

  onUpload() {
    this.waveService.uploadPicture(this.fileToUpload).subscribe((res) => {
      console.log(res);
    });
  }

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.forumForm = this.createFormGroup();
  }

  ngOnInit(): void {
    this.subcategoryId = this.route.snapshot.params['id'];
    this.waveService
      .getSubCategoryById(this.subcategoryId)
      .subscribe((response) => {
        this.subcategory = response.subcategory;
        console.log('content', this.subcategory);

        this.filteredForums = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value) => this._filter(value))
        );

        this.waveService
          .getFavoritesForums(
            this.subcategoryId,
            this.currentPage,
            this.currentPage2
          ) //este servicio trae favoritos y no favoritos
          .subscribe((response) => {
            console.log('suscribes', response);
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

            this.waveService.getAllForums({}).subscribe((response) => {
              this.forums = response.forums;
            });
          });
      });
  }

  getBack() {
    this.waveService.getPreviousUrl();
  }

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

  crearForo(idSubcategory: number, title: string) {
    this.waveService
      .createForum(idSubcategory, title)
      .subscribe((response: any) => {
        if (response) {
          console.log('foro creado');
          this.waveService.likeForum(response.forum.id).subscribe((res) => {
            if (res) {
              console.log(res);
              this.router.navigate([`/picture-foro/${response.forum.id}`]);
            }
          });
        }
      });
  }

  onSaveForm() {
    this.crearForo(this.subcategoryId, this.forumForm.value.text);
  }

  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService
        .getFavoritesForums(
          this.subcategoryId,
          this.currentPage,
          this.currentPage2
        ) //este servicio trae favoritos y no favoritos
        .subscribe((response) => {
          console.log('suscribes', response);
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

  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService
        .getFavoritesForums(
          this.subcategoryId,
          this.currentPage,
          this.currentPage2
        ) //este servicio trae favoritos y no favoritos
        .subscribe((response) => {
          console.log('suscribes', response);
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

  agregarFavorito() {
    console.log(this.subcategoryId);
    this.waveService
      .saveFavoriteSubCategoria(this.subcategoryId)
      .subscribe((response) => console.log(response));
    this.waveService
      .getSubCategoryById(this.subcategoryId)
      .subscribe((response) => {
        this.subcategory = response.subcategory;
        console.log('content', this.subcategory);
      });
  }

  get text() {
    return this.forumForm.get('text');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.favoriteForums.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }
}
