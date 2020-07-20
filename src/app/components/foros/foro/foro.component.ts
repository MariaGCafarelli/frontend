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
  foroId: number;
  Foro: any = {};
  forosFav = [];
  posts: any[] = [];
  postId: number;
  areThereNewPosts: boolean = false; // Cuando esta variable sea true tienes que mostrarle un pop-up al usuario para cargar los posts nuevos
  intervalControl: any;
  postComment = [];
  user: any;
  suscrito = false;
  currentPage: number = 1;
  nextPage: boolean;
  latestPosts: any;
  fecha: any;
  subcategoryId: any;
  subcategory: any;
  colorIcon: number;
  postForm: FormGroup;
  previousUrl: string;
  nospace = /^$|\s+/
  readonly  VAPID_PUBLIC_KEY  = "BBhlu3acwvyKzAoGjCFFmPvcjp22i275SExmGcnxNEalSaKYz5XzhpH-fZy123SUaSU1tFpXSh5Jyi-aV3Ju5as";
  createFormGroup() {
    return new FormGroup({
      text: new FormControl('', [
        Validators.required,
        Validators.maxLength(255),
        Validators.pattern(this.nospace)
      ]),
    });
  }

  constructor(private swPush: SwPush,
    private waveService: WaveServiceService,
    private postService: Postservice,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.postForm = this.createFormGroup();
  }
  @ViewChild('btnClose') btnClose: ElementRef;

  ngOnInit(): void {
    this.waveService.getCurrentUser().subscribe((userResponse) => {
      this.user = userResponse.user;
      console.log(this.user);
      this.foroId = this.route.snapshot.params['id'];
      this.waveService.getForumsById(this.foroId).subscribe((response) => {
        // console.log(response);
        this.Foro = response.forum;
        console.log(response);
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
          this.currentPage = parseInt(response.meta.currentPage);
          this.nextPage =
            this.currentPage !== parseInt(response.meta.totalPages);
          console.log('posts', this.posts);
          //this.postId = this.posts[this.posts.length - 1].id;
          
              this.postService
                .receivePosts(this.foroId)
                .subscribe((message: any) => {
                  if (message.user.email !== this.user.email) {
                    this.areThereNewPosts = true;
                  } else {
                    this.waveService
                      .getPostByForumId(this.foroId)
                      .subscribe((response) => {
                        this.posts = response.items;
                        console.log('posts', this.posts);
                        this.currentPage = parseInt(response.meta.currentPage);
                        this.nextPage =
                          this.currentPage !==
                          parseInt(response.meta.totalPages);
                        this.postId = this.posts[this.posts.length - 1].id;
                        window.scrollTo({ top: 0 });
                      });
                  }
                });
            
        });
      });
      this.previousUrl = this.waveService.getPreviousUrl();
    });
  }

  refreshPost() {
    this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
      this.areThereNewPosts = false;
      this.posts = response.items;
      this.currentPage = parseInt(response.meta.currentPage);
      this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
      this.postId = this.posts[this.posts.length - 1].id;
    });
  }

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

  putLikePost(id: number) {
    this.waveService.likePost(id).subscribe((res) => {
      if (res) {
        // console.log(res);
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
        });
      }
    });
  }

  postCom() {
    this.postService.sendPost({
      text: this.postForm.value.text,
      foroId: this.foroId,
      email: this.user.email,
    });
    this.postForm.reset();
    this.btnClose.nativeElement.click();
  }

  putDislikePost(id: number) {
    this.waveService.dislikePost(id).subscribe((res) => {
      if (res) {
        // console.log(res);
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
        });
      }
    });
  }

  agregarFavorito(subcategoriaId) {
    console.log(subcategoriaId);
    this.waveService
      .saveFavoriteSubCategoria(subcategoriaId)
      .subscribe((response) => console.log(response));
  }

  likeForo(id: number) {
    this.agregarFavorito(this.Foro.subCategory.id);
    
    this.waveService.likeForum(id).subscribe((res) => {
      if (res) {
        this.suscrito = true;
        this. swPush . requestSubscription ( {
          serverPublicKey : this . VAPID_PUBLIC_KEY
      } )
      . then ( sub  => console.log(sub)
        // this . waveService . addPushSubscriber ( sub ) . subscribe ( ) 
         )
      //. catch ( err  =>  console . error ( "No se pudo suscribir a las notificaciones" ,  err ) ) ;
        // console.log(res);
      }
    });
  }

  reset() {
    this.postForm.reset();
  }

  dislikeForo(id: number) {
    this.waveService.dislikeForum(id).subscribe((res) => {
      if (res) {
        this.suscrito = false;
        // console.log(res);
      }
    });
  }

  onDelete(id: number) {
    this.waveService.DeletePost(id).subscribe((res) => {
      if (res) {
        this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
          this.posts = response.items;
          this.currentPage = parseInt(response.meta.currentPage);
          this.nextPage =
            this.currentPage !== parseInt(response.meta.totalPages);
          console.log('posts', this.posts);
        });
      }
    });
  }

  get text() {
    return this.postForm.get('text');
  }
}
