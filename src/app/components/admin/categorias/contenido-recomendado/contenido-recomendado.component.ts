import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContentCategory } from 'src/app/model/content';

@Component({
  selector: 'app-contenido-recomendado',
  templateUrl: './contenido-recomendado.component.html',
  styleUrls: ['./contenido-recomendado.component.scss'],
})
export class ContenidoRecomendadoComponent implements OnInit {
  categoryId: number;
  categoryById: any;
  files: File[] = [];
  categories: any;
  panelOpenState = false;
  contenido: any;
  contentForm: FormGroup;
  pattern = /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
  
  public selected: ContentCategory = {
    id: null,
    title: null,
    text: null,
    link: null,
    image: null,
  };

  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  /**
   * Metodo que da formato al form group nombrando sus form controls y
   *  las validaciones a las que se someten
   * @returns FormGroup
   */
  createFormGroup() {
    return new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      link: new FormControl('', [
        Validators.required,
        Validators.pattern(this.pattern),
      ]),
    });
  }

  constructor(
    private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.contentForm = this.createFormGroup();
  }

  /**A callback method that is invoked immediately after the default change detector has checked the directive's data-bound properties for the first time, and before any of the view or content children have been checked.
   *  It is invoked only once when the directive is instantiated.
   * @returns void */
  ngOnInit(): void {
    this.waveService.getAllCategoriesContent().subscribe((response) => {
      this.categories = response;
      console.log('categorias', this.categories);
    });
  }
  
  /**Captura el id de la categoria seleccionada desde el archivo html
   * @returns void
   */
  catchId(id) {
    this.categoryId = id;
  }

  /**
   * Metodo que recibe el id del content category como parametro, para solicitar taerse 
   * todos sus datos al servicio
   * @param id 
   * @returns void
   */
  getContenido(id: number) {
    this.waveService.getContentCategory(id).subscribe((response) => {
      console.log(response);
    });
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
   * metodo que envia los datos pertinentes al servicio para registrar 
   * un content category nuevo
   * @returns void
   */
  onSaveForm() {
    if (!this.selected.id) {
      if (this.contentForm.valid) {
        if(this.files.length>0){
        this.spinner.show();
        this.waveService
          .CreateContent(
            this.categoryId,
            this.contentForm.value.titulo,
            this.contentForm.value.descripcion,
            this.contentForm.value.link
          )
          .subscribe((res) => {
            if (res) {
              this.waveService.SavePicContent(res.content.id, this.files).subscribe
               ((res)=>{
               if(res){
                console.log(res)
              this.waveService
                .getAllCategoriesContent()
                .subscribe((response) => {
                  this.categories = response;
                  console.log('categorias', this.categories);
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
        this.reset()
      }
    }
    } else {
      if (this.contentForm.valid) {
        this.spinner.show();
        this.waveService
          .updateContent(
            this.selected.id,
            this.selected.title,
            this.selected.text,
            this.selected.link
          )
          .subscribe((res) => {
            if (res) {
              console.log(res);
              this.waveService
                .getAllCategoriesContent()
                .subscribe((response) => {
                  this.categories = response;
                  console.log('categorias', this.categories);
                  this.spinner.hide();
                  this.btnClose.nativeElement.click();
                });
            }
          });

        this.contentForm.reset();
        this.btnClose.nativeElement.click();
      }
      this.contentForm.reset();
    }
  }

  
  /**Metodo que recibe el id del content category seleccionado para cambiar su estado
   * de activo a inactivo, o viceversa, y lo manda al servicio para hacer lo correspondiente,
   * tambien actualiza el arreglo existente
   * @returns void
   */
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.statusContent(id).subscribe((data) => {
      console.log(data);
      this.waveService.getAllCategoriesContent().subscribe((response) => {
        this.categories = response;
        console.log('categorias', this.categories);
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
   * al content category seleccionado
   * @returns void
   */

  updatePic(){
    if(this.files.length>0){
      this.spinner.show();
    this.waveService.SavePicContent(this.selected.id, this.files).subscribe
    ((res)=>{
     if(res){
       this.btnClose2.nativeElement.click();
       this.spinner.hide();
     console.log(res)
  }}
  )}else{
    alert("Debe seleccionar una imagen");
    this.reset();
  }
}
  ;

  
  /**Metodo que resetea el form y todos los datos necesarios para que no se 
   * repitan valores.
   * @returns void
   */
  reset(){
    this.contentForm.reset();
    this.files=[];
    this.selected = {
      id: null,
      title: null,
      text: null,
      link: null,
      image: null,
    };
  }

  /** 
        *  getters para obtener un child control de titulo dado el nombre
        * @returns AbstractControl
       */
  get titulo() {
    return this.contentForm.get('titulo');
  }

  /** 
        *  getters para obtener un child control de descripcion dado el nombre
        * @returns AbstractControl
       */
  get descripcion() {
    return this.contentForm.get('descripcion');
  }

  /** 
  *  getters para obtener un child control de link dado el nombre
  * @returns AbstractControl
  */
  get link() {
    return this.contentForm.get('link');
  }
}
