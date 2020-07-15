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
  subCategories: any[] = [];
  files: File[] = [];
  panelOpenState = false;
  public selected:SubCategory = {
    id: null,
    name: null,
    text: null,
    category:null,
    imagen:null   
  };
  subCategoryForm: FormGroup;
  idCategory:number;

  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
  

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


  ngOnInit(): void {
    this.waveService.getSubcategoriesWCategories().subscribe((response) => {
      this.subCategories = response;
      console.log('subcategorias', response);      
    });
    
  }

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
  preUpdate(content: any){
    this.selected = Object.assign({},content);   
}

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

  updatePic(){
    if(this.files.length>0){
      this.spinner.show();
    this.waveService.updatePicSubCategory(this.selected.id, this.files).subscribe
    ((res)=>{
      console.log(res)
      this.waveService.getSubcategoriesWCategories().subscribe((response) => {
        this.subCategories = response;
        this.btnClose.nativeElement.click();
        this.spinner.hide();
      });
     
  }
  )}else{
    alert("Debe seleccionar una imagen");
    this.reset();
  }
}

get name() {
  return this.subCategoryForm.get('name');
}

get text() {
  return this.subCategoryForm.get('text');
}

}