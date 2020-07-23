import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Foro } from 'src/app/model/foro';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-foros-admin',
  templateUrl: './foros-admin.component.html',
  styleUrls: ['./foros-admin.component.scss'],
})
export class ForosAdminComponent implements OnInit {
  categories: any[] = [];
  subcategoryId: number;
  files: File[] = [];
  panelOpenState = false;
  panelOpenState2 = false;
  foroForm: FormGroup;
  forums: any[] = [];
  filteredForums: Observable<string[]>;
  filterForum = '';
  myControl = new FormControl();
  currentPage: number = 1;
  nextPage: boolean = false;
  myforums: any;
  notMyforums: any[] = [];
  currentUrl: string;
  previousUrl: string;
  subcategories: any[];
  selectedIdCategory: number;
  selectedIdSubcategory: number;
  searchTermText: string;
  searchText: string;
  searchTextModelChanged: Subject<string> = new Subject<string>();
  searchTextModelChangeSubscription: Subscription;

  public selected:Foro = {
    id: null,
    title: null,
    image: null,
    subcategory: null
  };
 
  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;
 
  /**
   * Metodo que da formato al form group nombrando sus form controls y
   *  las validaciones a las que se someten
   * @returns FormGroup
   */
  createFormGroup() {
    return new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  constructor(private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.foroForm = this.createFormGroup();
  }

  ngOnInit(): void {

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
    // Carga todos los Foros
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
   * metodo que envia los datos pertinentes al servicio para registrar 
   * un foro nuevo
   * @returns void
   */

  onSubmit(){
  
    if(!this.selected.id){
      if(this.files.length>0){
        if(this.foroForm.valid){
        this.spinner.show();
        this.waveService.createForumByAdmin(this.subcategoryId, this.foroForm.value.title ).
        subscribe((res)=>{
          console.log(res);
          this.waveService.updatePicForum(res.forum.id, this.files).subscribe((res)=>{
             
              this.foroForm.reset();
              this.waveService.getAllForums({}).subscribe((response) => {
                this.forums = response.items;
                this.spinner.hide();
              });
              
              this.btnClose.nativeElement.click();
          })
        })
        }else{
        alert('Algunos de los datos ingresados son incorrectos')
        }
     }else{
       this.reset()
       alert('Debe cargar una imagen primero');
     }
    }else {
      if (this.foroForm.valid) {
        this.spinner.show();
        this.waveService
          .updateForum(
            this.selected.id,
            this.selected.title
          )
          .subscribe((res) => {
            if (res) {
              
                this.waveService.getAllForums({}).subscribe((response) => {
                  this.forums = response.items;
                  this.spinner.hide();
                  this.btnClose.nativeElement.click();
                });
            }
          });
  
        this.foroForm.reset();
        this.btnClose.nativeElement.click();
      }
      this.foroForm.reset();
    }
  }


  /**Captura el id de la subcategoria seleccionada para crearle unforo
   * desde el archivo html
   * @returns void
   */
  catchId(id) {
    this.subcategoryId = id;
  }

  /**metodo que recibe un objetivo para filtrar los foros 
   * por la categoria seleccionada
   * @returns void
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

  /**metodo que recibe un objetivo para filtrar los foros 
   * por la subcategoria seleccionada
   * @returns void
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

  /**metodo que trae y añade al array existente el siguiente grupo de 
   * foros paginados en el backend
   * @returns void
   *  */
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
  
  /**Metodo que recibe el id del foro seleccionado para cambiar su estado
   * de activo a inactivo, o viceversa, y lo manda al servicio para hacer lo correspondiente,
   * tambien actualiza el arreglo existente
   * @returns void
   */
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.statusForo(id).subscribe((data) => {
      
      this.waveService.getAllForums({}).subscribe((response) => {
        this.forums = response.items;
        this.spinner.hide();
      });
    });
  }

  /**Recibe un objeto seleccionado en el html como parametro
   *  y asigna sus valores al selected
   * @param content
   * @returns void
   * 
    */
  preUpdate(content: any){
    this.selected = Object.assign({},content);
       
}

/**
   * metodo que manda al servicio los datos necesarios para asignar una imagen
   * al foro seleccionado
   * @returns void
   */
updatePic(){
  if(this.files.length>0){
    this.spinner.show()
  this.waveService.updatePicForum(this.selected.id, this.files).subscribe
  ((res)=>{
   if(res){
    this.waveService.getAllForums({}).subscribe((response) => {
      this.forums = response.items;
      this.btnClose2.nativeElement.click();
      this.spinner.hide();
    });
    
}}
)}else{
  alert("Debe seleccionar una imagen");
  this.reset();
}
}

/**Metodo que resetea el form y todos los datos necesarios para que no se 
   * repitan valores.
   * @returns void
   */
reset(){
  this.foroForm.reset();
  this.files=[];
  this.selected = {
    id: null,
    title: null,
    image: null
  };
}

/**Metodo que recibe y maneja el evento que ocurre al seleccionar un archivo,
   * y mete este archivo al files array
   * @returns void
   */
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  /**Metodo que recibe y maneja el evento que ocurre al eliminar un archivo 
   * un archivo del srop area,
   * y elimina este archivo del files array
   * @returns void
   */
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  /** 
        *  getters para obtener un child control de title dado el nombre
        * @returns AbstractControl
       */
  get title() {
    return this.foroForm.get('title');
  }



}
        
      
