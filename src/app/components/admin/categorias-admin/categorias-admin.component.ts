import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/model/category';

@Component({
  selector: 'app-categorias-admin',
  templateUrl: './categorias-admin.component.html',
  styleUrls: ['./categorias-admin.component.scss']
})
export class CategoriasAdminComponent implements OnInit {
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;
  CategoryForm: FormGroup;
  files:File[]=[];
  public selected: Category = {
    id: null,
    name: null,
    text: null,
    image: null,
  };
  categories: any;

  /**
   * Metodo que da formato al form group nombrando sus form controls y
   *  las validaciones a las que se someten
   * @returns FormGroup
   */
  createFormGroup() {
    return new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      text: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
    });
  }
  
  constructor(private spinner: NgxSpinnerService,
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router) { 
      this.CategoryForm = this.createFormGroup();
    }
  
 

  ngOnInit(): void {
    this.waveService.getAllCategories().subscribe((response) => {
      this.categories = response;
      console.log('categorias', this.categories);
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
   * un archivo del drop area,
   * y elimina este archivo del files array
   * @returns void
   */
  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

   /**Metodo que recibe el id de la categoria seleccionada para cambiar su estado
   * de activo a inactivo, o viceversa, y lo manda al servicio para hacer lo correspondiente,
   * tambien actualiza el arreglo existente
   * @returns void
   */
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.stateCategory(id).subscribe((data) => {
      this.waveService.getAllCategories().subscribe((response) => {
        this.categories = response;
        this.spinner.hide();
      });
    });
  }


  reset(){
    this.CategoryForm.reset();
    this.files=[];
    this.selected = {
      id: null,
      name: null,
      text: null,   
      image: null
    };
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
   * a la categoria seleccionada
   * @returns void
   */
updatePic(){
  if(this.files.length>0){
  this.waveService.updatePicCategory(this.selected.id, this.files).subscribe
  ((res)=>{
    this.waveService.getAllCategories().subscribe((response) => {
      this.categories = response;
      this.btnClose2.nativeElement.click();
    });
}
)
this.btnClose2.nativeElement.click();
}else{
  alert("Debe seleccionar una imagen");
  this.reset();
}
}

  /**
   * metodo que envia los datos pertinentes al servicio para registrar 
   * una categoria nueva
   * @returns void
   */
  onSubmit(){
  
  if(!this.selected.id){
    if(this.files.length>0){
      if(this.CategoryForm.valid){
      this.spinner.show();
      this.waveService.CreateCategory(this.CategoryForm.value.name, this.CategoryForm.value.text).
      subscribe((res)=>{
        console.log(res);
        this.waveService.updatePicCategory(res.category.id, this.files).subscribe((res)=>{
            console.log(res);
            this.CategoryForm.reset();
            this.waveService.getAllCategories().subscribe((response) => {
              this.categories = response;
              console.log('categorias', this.categories);
              this.spinner.hide();
            });
            
            this.btnClose.nativeElement.click();
        })
      })
      }else{
      alert('Algunos de los datos ingresados son incorrectos')
      }
   }else{
     alert('Debe cargar una imagen primero');
     this.reset()
   }
  }else {
    if (this.CategoryForm.valid) {
      this.spinner.show();
      this.waveService
        .updateCategory(
          this.selected.id,
          this.selected.name,
          this.selected.text
        )
        .subscribe((res) => {
          if (res) {
            console.log(res);
            this.waveService
              .getAllCategories()
              .subscribe((response) => {
                this.categories = response;
                console.log('categorias', this.categories);
                this.spinner.hide();
                this.btnClose.nativeElement.click();
              });
          }
        });

      this.CategoryForm.reset();
      this.btnClose.nativeElement.click();
    }
    this.CategoryForm.reset();
  }
  }

   /** 
  *  getters para obtener un child control de name dado el nombre
  * @returns AbstractControl
  */
  get name() {
    return this.CategoryForm.get('name');
  }

   /** 
  *  getters para obtener un child control de text dado el nombre
  * @returns AbstractControl
  */
  get text() {
    return this.CategoryForm.get('text');
  }

}
