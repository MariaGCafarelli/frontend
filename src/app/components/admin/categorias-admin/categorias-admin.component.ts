import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { WaveServiceService } from 'src/app/services/wave-service.service';

@Component({
  selector: 'app-categorias-admin',
  templateUrl: './categorias-admin.component.html',
  styleUrls: ['./categorias-admin.component.scss']
})
export class CategoriasAdminComponent implements OnInit {
  CategoryForm: FormGroup;
  files:File[];

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
  
  constructor(private spinner: NgxSpinnerService,
    private waveService: WaveServiceService) { 
      this.CategoryForm = this.createFormGroup();
    }

  ngOnInit(): void {
  }

  ChangeStatus(id: number) {
    this.spinner.show();
    this.waveService.stateSubCategory(id).subscribe((data) => {
      console.log(data);
        this.spinner.hide();
    });
  }

  onSubmit(){
    if(this.CategoryForm.valid){
      this.spinner.show();
      this.waveService.CreateCategory(this.CategoryForm.value.name, this.CategoryForm.value.text).
      subscribe((res)=>{
        console.log(res);
        this.waveService.updatePicCategory(res.category.id, this.files).subscribe((res)=>{
            console.log(res);
            this.CategoryForm.reset();
            this.spinner.hide();
        })
      })
    }
  }

}
