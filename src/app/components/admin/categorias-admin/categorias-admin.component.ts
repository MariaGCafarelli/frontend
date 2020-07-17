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
  CategoryForm: FormGroup;
  files:File[]=[];
  public selected: Category = {
    id: null,
    name: null,
    text: null,
    image: null,
  };
  categories: any;

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

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

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

  preUpdate(content: any){
    this.selected = Object.assign({},content);
    
    
}

updatePic(){
  if(this.files.length>0){
  this.waveService.updatePicCategory(this.selected.id, this.files).subscribe
  ((res)=>{
    this.waveService.getAllCategories().subscribe((response) => {
      this.categories = response;
      console.log('categorias', this.categories);
    });
}
)
this.btnClose.nativeElement.click();
}else{
  alert("Debe seleccionar una imagen");
  this.reset();
}
}

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

  get name() {
    return this.CategoryForm.get('name');
  }

  get text() {
    return this.CategoryForm.get('text');
  }

}
