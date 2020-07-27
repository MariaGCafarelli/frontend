import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Postservice } from 'src/app/services/post.socket.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
})
export class ForoComponent implements OnInit {
  foroId: number; // Id del foro
  Foro: any = {}; // Objeto foro
  posts: any[] = []; // Arreglo de comentarios del foro
  postId: number; // Id del comentario nuevo
  areThereNewPosts: boolean = false; // Cuando esta variable sea true el usuario puede recargar post
  user: any; // Objeto usuario actual
  currentPage: number = 1; //Pagina actual de la paginacion de comentarios
  nextPage: boolean;
  postForm: FormGroup; // Formulario input
  previousUrl: string; // Ruta anterior
  nospace = /^$|\s+/; //Validaciones
  readonly VAPID_PUBLIC_KEY =
    'BBhlu3acwvyKzAoGjCFFmPvcjp22i275SExmGcnxNEalSaKYz5XzhpH-fZy123SUaSU1tFpXSh5Jyi-aV3Ju5as';
  selectedP: string;

  constructor(
    private swPush: SwPush,
    private waveService: WaveServiceService,
    private postService: Postservice,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.createFormGroup();
  }

  @ViewChild('btnClose') btnClose: ElementRef;

  ngOnInit(): void {
    /**
     * Servicio que trae el usuario actual
     * inicializa el objeto user
     */

    this.waveService.getCurrentUser().subscribe((userResponse) => {
      this.user = userResponse.user;
    });

    /**
     * Servicio que trae el foro segun el id en la ruta
     * inicializa el objeto Foro
     */
    this.foroId = this.route.snapshot.params['id'];
    this.waveService.getForumsById(this.foroId).subscribe((response) => {
      this.Foro = response.forum;
    });

    /**
     * Servicio que trae los comentarios del foro segun la ruta
     * paginados, inicializa el arreglo de posts y la paginacion
     */
    this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
      this.posts = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
    });

    /**
     * Servicio que segun la ruta, verifica si existen post nuevos no hechos por
     * el usuario, de lo contrario actualiza el arreglo de post con el nuevo,
     * y actualiza la paginacion, devolviendo scroll al top de la pantalla
     */
    this.postService.receivePosts(this.foroId).subscribe((message: any) => {
      if (message.user.email !== this.user.email) {
        this.areThereNewPosts = true;
      } else {
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
          this.currentPage = parseInt(response.meta.currentPage);
          this.nextPage =
            this.currentPage !== parseInt(response.meta.totalPages);
          this.postId = this.posts[this.posts.length - 1].id;
          window.scrollTo({ top: 0 });
        });
      }
    });
  }

  /**
   * Funcion que inicializa el formulario y sus validaciones
   * @return Objeto Form Group inicializado
   */
  createFormGroup() {
    return new FormGroup({
      text: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
      ]),
    });
  }

  /**
   * Funcion que guarda en una variable el string de la foto de usuario
   * @param pic string
   * @return void
   */
  capturePic(pic: string) {
    this.selectedP = pic;
  }

  /**
   * Funcion que vacia los campos del formulario foto de perfil
   * @return void
   */
  resetP() {
    this.selectedP = '';
  }

  /**
   * Funcion que trae la ultima ruta almacenada del location de la aplicacion
   * @return void
   */
  getBack() {
    this.waveService.getPreviousUrl();
  }

  /**
   * Funcion que actualiza los post nuevos publicados en el foro
   * actualiza el estado de la variable areThereNewPosts
   * actualiza el arreglo post
   * actualiza el estado de la paginacion
   * @return void
   */
  refreshPost() {
    this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
      this.areThereNewPosts = false;
      this.posts = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      this.postId = this.posts[this.posts.length - 1].id;
    });
  }

  /**
   * Funcion que trae el siguiente grupo de comentarios segun
   * la paginación actual, actualiza el arreglo de posts y
   * las paginas
   * @return void
   */
  traerMasComentarios() {
    this.waveService
      .getPostByForumId(this.foroId, this.currentPage + 1)
      .subscribe((response) => {
        this.posts = this.posts.concat(response.items);
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
        this.postId = this.posts[this.posts.length - 1].id;
      });
  }

  /**
   * Funcion que usa el servicio que agrega un like al comentario en el foro,
   * actualiza el arreglo posts
   * @param id id del post
   * @return void
   */
  putLikePost(id: number) {
    this.waveService.likePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
        });
      }
    });
  }

  /**
   * Funcion que usa el servicio que un like dado al comentario en el foro,
   * actualiza el arreglo posts
   * @param id id del post
   * @return void
   */
  putDislikePost(id: number) {
    this.waveService.dislikePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
        });
      }
    });
  }

  /**
   * Funcion que crea el nuevo comentario segun input del ususario
   * valida su contenido y luego vacia los campos
   * @return void
   */
  postCom() {
    if (this.postForm.value.text.trim() != '') {
      this.postService.sendPost({
        text: this.postForm.value.text,
        foroId: this.foroId,
        email: this.user.email,
      });
      this.postForm.reset();
      this.btnClose.nativeElement.click();
    } else {
      alert('Por favor ingrese un comentario');
    }
  }

  /**
   * Funcion que usa el servicio que agrega una subcategoria a las favoritas del ususario,
   * actualiza el objeto subcategoria
   * @param subcategoryId id de la subcategoria a la que pertenece el foro
   * @return void
   */
  agregarFavorito(subcategoryId: number) {
    console.log(subcategoryId);
    this.waveService
      .saveFavoriteSubCategoria(subcategoryId)
      .subscribe((response) => console.log(response));
  }

  /**
   * Funcion que usa el servicio que agrega un foro a los suscritos del ususario,
   * envia notificacion push a los usuarios ya suscritos en el foro
   * actualiza el onjeto Foro
   * @param id id del foro
   * @return void
   */
  likeForo(id: number) {
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.agregarFavorito(this.Foro.subCategory.id);
        this.waveService.getForumsById(this.foroId).subscribe((response) => {
          this.Foro = response.forum;
        });
        this.swPush
          .requestSubscription({
            serverPublicKey: this.VAPID_PUBLIC_KEY,
          })
          .then((sub) =>
            this.waveService
              .addPushSubscriber(sub.toJSON())
              .subscribe((res) => {
                console.log(res);
              })
          )
          .catch((err) =>
            console.error('Could not subscribe to notifications', err)
          );
        console.log(res);
      }
    });
  }

  reset() {
    this.postForm.reset();
  }

  /**
   * Funcion que usa el servicio que elimina un foro a los suscritos del ususario,
   * actualiza el objeto Foro
   * @param id id del foro
   * @return void
   */
  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        this.waveService.getForumsById(this.foroId).subscribe((response) => {
          this.Foro = response.forum;
        });
      }
    });
  }

  /**
   * Funcion que usa el servicio que elimina un comentario hecho por el ususario
   * en el foro, actualiza el arreglo posts y la paginacion
   * @param id id del comentario
   * @return void
   */
  onDelete(id: number) {
    this.waveService.DeletePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
          this.currentPage = parseInt(response.meta.currentPage);
          this.nextPage =
            this.currentPage !== parseInt(response.meta.totalPages);
        });
      }
    });
  }

  /**
   * Funcion que almacena el input ingresado por el usuario como comentario
   * @return string
   */
  get text() {
    return this.postForm.get('text');
  }
}
