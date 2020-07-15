import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Foro } from 'src/app/model/foro';

@Component({
  selector: 'app-foros-admin',
  templateUrl: './foros-admin.component.html',
  styleUrls: ['./foros-admin.component.scss'],
})
export class ForosAdminComponent implements OnInit {
  categories: any[] = [];
  files: File[] = [];
  panelOpenState = false;
  panelOpenState2 = false;
  foroForm: FormGroup;
  public selected:Foro = {
    id: null,
    title: null,
    image: null,
    subcategory: null
  };
  subcategoryId: any;
  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
 

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
    this.waveService.getAllForumsAdmin().subscribe((response) => {
      this.categories = response;
    });
  }

  onSubmit(){
  
    if(!this.selected.id){
      if(this.files.length>0){
        if(this.foroForm.valid){
        this.spinner.show();
        this.waveService.CreateCategory(this.foroForm.value.title, this.subcategoryId).
        subscribe((res)=>{
          console.log(res);
          this.waveService.updatePicCategory(res.forum.id, this.files).subscribe((res)=>{
              console.log(res);
              this.foroForm.reset();
              this.waveService.getAllForumsAdmin().subscribe((response) => {
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
              console.log(res);
              this.waveService.getAllForumsAdmin().subscribe((response) => {
                  this.categories = response;
                  console.log('categorias', this.categories);
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

  catchId(id) {
    this.subcategoryId = id;
  }
  
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.statusForo(id).subscribe((data) => {
      console.log(data);
      this.waveService.getAllForumsAdmin().subscribe((response) => {
        this.categories = response;;
        this.spinner.hide();
      });
    });
  }

  preUpdate(content: any){
    this.selected = Object.assign({},content);
    
    
}

updatePic(){
  if(this.files.length>0){
  this.waveService.updatePicForum(this.selected.id, this.files).subscribe
  ((res)=>{
   if(res){
   console.log(res)
}}
)}else{
  alert("Debe seleccionar una imagen");
  this.reset();
}
}

reset(){
  this.foroForm.reset();
  this.files=[];
  this.selected = {
    id: null,
    title: null,
    image: null
  };
}

  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  get title() {
    return this.foroForm.get('title');
  }
}
