import { Component, OnInit } from '@angular/core';
import { WaveServiceService } from 'src/app/services/wave-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {
  foroId: any;
  Foro: any = {};
  posts: any[] = [];
  currentPage: number = 1;
  nextPage: boolean;
  postId: any;

  constructor(
    private waveService: WaveServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.foroId = this.route.snapshot.params['id'];
    this.waveService.getForumsById(this.foroId).subscribe((response) => {
      // console.log(response);
      this.Foro = response.forum;
      console.log(this.Foro);
      this.waveService.getPostByForumId(this.foroId).subscribe((response) => {
        this.posts = response.items;
        this.currentPage = parseInt(response.meta.currentPage);
        this.nextPage = this.currentPage !== parseInt(response.meta.totalPages);
        console.log('posts', this.posts);
      });
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

}
