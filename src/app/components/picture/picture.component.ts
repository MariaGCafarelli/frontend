import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {
  fileToUpload = null;
  imageUrl=null;
  file:any;
  im= false;

  /**
   * Transforma la imagen montada por el usuario en string64
   * @param file imagen que desea montar el usuario
   */
  handleFileInput(file: FileList) {
    console.log(file);
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload)
    this.im = true;

    var reader = new FileReader();
    reader.onloadend = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    console.log(reader.result);
  }
  /**
   * Condicional:
   * compara si fileToUpload es distinto a null, de ser asi se procede a montar la imagen en la base, muestra el spinner hasta que este proceso finalice
   * sino mostrara un alerta al usuario que no ha seleccionado una imagen
   */
  onUpload() {
    if (this.fileToUpload != null) {
      this.spinner.show();
      this.wave.uploadPicture(this.fileToUpload).subscribe(res => {
        console.log(res);
        this.spinner.hide();
      })
    } else {
      alert('¡Primero debes cargar una imagen!, busca en la nube');
    }
  }

  constructor(private spinner: NgxSpinnerService, private wave:WaveServiceService) { }

  ngOnInit(): void {
  }

}
