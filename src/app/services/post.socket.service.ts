import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { PostDto } from '../dto/post-socket.dto';

@Injectable({
  providedIn: 'root',
})
export class Postservice {
  constructor(private socket: Socket) {}

  sendPost(post: PostDto) {
    this.socket.emit('posts', post);
  }

  receivePosts(forumId: number) {
    return this.socket.fromEvent(`forum-${forumId}`);
  }
}
