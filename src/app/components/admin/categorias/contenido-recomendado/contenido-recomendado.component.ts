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
  @ViewChild(MatAccordion) accordion: MatAccordion;

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

  ngOnInit(): void {
    this.waveService.getAllCategoriesContent().subscribe((response) => {
      this.categories = response;
      console.log('categorias', this.categories);
    });
  }

  catchId(id) {
    this.categoryId = id;
  }
  getContenido(id: number) {
    this.waveService.getContentCategory(id).subscribe((response) => {
      console.log(response);
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
        this.reset();
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

  preUpdate(content: any){
      this.selected = Object.assign({},content);
      
      
  }

  updatePic(){
    if(this.files.length>0){
    this.waveService.SavePicContent(this.selected.id, this.files).subscribe
    ((res)=>{
     if(res){
     console.log(res)
  }}
  )}else{
    alert("Debe seleccionar una imagen");
    this.reset();
  }
}
  ;

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

  get titulo() {
    return this.contentForm.get('titulo');
  }
  get descripcion() {
    return this.contentForm.get('descripcion');
  }
  get link() {
    return this.contentForm.get('link');
  }
}
