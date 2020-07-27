import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { SubCategory } from 'src/app/model/sub-category';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss']
})
export class SubAdminComponent implements OnInit {
  subCategories: any[] = []; // Arreglo de tipo subcategoria
  files: File[] = []; // Arreglo de tipo file
  panelOpenState = false; //
  public selected:SubCategory = {
    id: null,
    name: null,
    text: null,
    category:null,
    imagen:null   
  }; // subcategoria seleccionada
  subCategoryForm: FormGroup; // Formulario de subcategoria
  idCategory:number; // Id de Categoria

  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;
  
/**
 * Formulario de Creación de un Objeto
 * @returns void
 */
  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.subCategoryForm = this.createFormGroup();
  }
  catchId(id) {
    this.idCategory = id;
  }

/**
 * Servicio que trae las Categorias con sus subcategorias paginadas
 * @returns void
 */
  ngOnInit(): void {
    this.waveService.getSubcategoriesWCategories().subscribe((response) => {
      this.subCategories = response;
      console.log('subcategorias', response);      
    });   
  }

  /**
   * Funcion para Crear una Subcategoria
   * @returns void
   */
  onSubmit(){
    if (!this.selected.id) {
      if (this.subCategoryForm.valid) {
        if(this.files.length>0){
        this.spinner.show();
        this.waveService.CreateSubCategory(
            this.subCategoryForm.value.name,
            this.subCategoryForm.value.text,
            this.idCategory)
          .subscribe((res) => {
              if (res) {
              console.log(res);
              this.waveService.updatePicSubCategory(res.SubCategory.id, this.files).subscribe
               ((res)=>{
               if(res){
                console.log(res)
                this.waveService.getSubcategoriesWCategories().subscribe((response) => {
                  this.subCategories = response;
                  this.spinner.hide();
                  this.btnClose.nativeElement.click();
                });

               }
              else{ this.spinner.hide();}
              })
            }
          });
      }else{
        alert("Debe cargar una imagen primero");
        this.reset();
      }
    }
    }else{
      if (this.subCategoryForm.valid) {
        this.spinner.show();
        this.waveService
          .updateSubcategory(
            this.selected.id,
            this.selected.name,
            this.selected.text
          )
          .subscribe((res) => {
            if (res) {
              console.log(res);
              this.waveService.getSubcategoriesWCategories().subscribe((response) => {
                  this.subCategories = response;
                  console.log('categorias', this.subCategories);
                  this.spinner.hide();
                  this.btnClose.nativeElement.click();
                });
            }
          });

        this.subCategoryForm.reset();
        this.btnClose.nativeElement.click();
      }
      this.subCategoryForm.reset();
    }
  }


  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

    /**
     * Funcion que coloca valor al selected para que se refleje en el form
     * @returns void
     * @param event 
     */
  preUpdate(content: any){
    this.selected = Object.assign({},content);   
}

/**
 * Funcion que tiene como parametros el id de una subcategoria y cambia el estado que tenga de activo a inactivo o viceversa
 * @param id id de subcategoria
 * @returns void
 */
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.stateSubCategory(id).subscribe((data) => {
      console.log(data);
      this.waveService.getSubcategoriesWCategories().subscribe((response) => {
        this.subCategories = response;
        this.spinner.hide();
      });
    });
  }

  /**
   * Funcion que reinicia el formulario de Subcategoria
   * @returns void
   */
  reset(){
    this.subCategoryForm.reset();
    this.files=[];
    this.selected = {
      id: null,
      name: null,
      text: null,
      imagen: null,
    };
  }

  /**
   * Función que cambia la foto de subcategoria, en caso de no haber colocado ninguna saldra una notificación al usuario
   * @returns void
   */
  updatePic(){
    if(this.files.length>0){
      this.spinner.show();
    this.waveService.updatePicSubCategory(this.selected.id, this.files).subscribe
    ((res)=>{
      console.log(res)
      this.waveService.getSubcategoriesWCategories().subscribe((response) => {
        this.subCategories = response;
        this.btnClose2.nativeElement.click();
        this.spinner.hide();
      });
     
  }
  )}else{
    alert("Debe seleccionar una imagen");
    this.reset();
  }
}

 /**
 * Funcion que trae el name
 * @returns void
 */
get name() {
  return this.subCategoryForm.get('name');
}

 /**
 * Funcion que trae el text
 * @returns void
 */
get text() {
  return this.subCategoryForm.get('text');
}

}