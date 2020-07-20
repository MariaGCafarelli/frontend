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
  subcategoryId: number;
  

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('btnClose') btnClose: ElementRef;
  @ViewChild('btnClose2') btnClose2: ElementRef;
 

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
              console.log("foros",this.forums)
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
      console.log("foros",this.forums)
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      this.waveService.getForumsPostsByUser().subscribe((res) => {
        this.myforums = res.forums;
        console.log(this.myforums);
        
      });
    });
  }

  onSubmit(){
  
    if(!this.selected.id){
      if(this.files.length>0){
        if(this.foroForm.valid){
        this.spinner.show();
        this.waveService.createForumByAdmin(this.subcategoryId, this.foroForm.value.title ).
        subscribe((res)=>{
          console.log(res);
          this.waveService.updatePicForum(res.forum.id, this.files).subscribe((res)=>{
              console.log(res);
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
              console.log(res);
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


  catchId(id) {
    this.subcategoryId = id;
  }

  
  onChangeCategory(target) {
    this.selectedIdCategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        console.log(response);
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

  onChangeSubcategory(target) {
    this.selectedIdSubcategory = target.value;
    this.waveService
      .getAllForums({
        selectedIdCategory: this.selectedIdCategory,
        selectedIdSubcategory: this.selectedIdSubcategory,
        searchTerm: this.searchTermText,
      })
      .subscribe((response) => {
        console.log(response);
        this.forums = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      });
  }

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
  
  changeStatus(id: number) {
    this.spinner.show();
    this.waveService.statusForo(id).subscribe((data) => {
      console.log(data);
      this.waveService.getAllForums({}).subscribe((response) => {
        this.forums = response.items;
        this.spinner.hide();
      });
    });
  }

  isActive(id: number){
 
  }

  preUpdate(content: any){
    this.selected = Object.assign({},content);
       
}

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



  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
          console.log(this.myforums);
        });
      }
    });
  }

  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        console.log(res);
        this.waveService.getForumsPostsByUser().subscribe((res) => {
          this.myforums = res.forums;
          console.log(this.myforums);
        });
        
      }
    });
  }

  isFav(id: number) {
    let vart;
    if (this.myforums) {
      vart = this.myforums.find((ob) => ob.id == id);
      if (vart == null) {
        return false;
      }
      return true;
    }
  }
}
