import { Injectable } from '@angular/core';
import { AbstractJsEmitterVisitor } from '@angular/compiler/src/output/abstract_js_emitter';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { RespI } from '../model/resp-i';

@Injectable({
  providedIn: 'root',
})
export class WaveServiceService {
  //url = 'http://localhost:3000';
  url = 'https://wave-service.herokuapp.com';

  public token: string;
  public picture: string;
  public user: any;
  private previousUrl: string;
  private currentUrl: string;
  private authSubject = new BehaviorSubject(false);

  //
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  }
  //

  constructor(private http: HttpClient, private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'aplication/json',
  });

  //metodo del servicio que hace http request y espera la respuesta de tipo RespI
  //que es una interfaz hubicada en la carpeta model, en caso de existir la respuesta llama al metodo que guarda el token en localstorage
  loginUser(email: String, password: String): Observable<any> {
    return this.http
      .post<any>(`${this.url}/user/login`, { email, password })
      .pipe(
        tap((res: any) => {
          if (res) {
            console.log(res);
            this.saveToken(res.accessToken);
            this.saveUser(res.user);
          } else {
            console.log('no hay respuesta');
          }
        })
      );
  }

  registerUser(
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    birthday: Date,
    password: string,
    role: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.url}/user/register`, {
        firstName,
        lastName,
        userName,
        email,
        birthday,
        password,
        role,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            console.log(res);
            this.saveToken(res.accessToken);
            this.saveUser(res.userCreated);
          } else {
            console.log('no hay respuesta');
          }
        })
      );
  }

  getAllForumsAdmin(): Observable<any> {
    return this.http.get(`${this.url}/category/admin/all/subcategories/forums`);
  }

  registerAdmin(
    firstName: string,
    lastName: string,
    userName: string,
    email: string,
    birthday: Date,
    password: string
  ): Observable<any> {
    return this.http
      .post<any>(`${this.url}/user/register/admin`, {
        firstName,
        lastName,
        userName,
        email,
        birthday,
        password,
      })
      .pipe(
        tap((res: any) => {
          if (res) {
            console.log(res);
          } else {
            console.log('no hay respuesta');
          }
        })
      );
  }

  uploadPicture(file: File): Observable<any> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/user/profile/photo/upload`, fd).pipe(
      tap((res: any) => {
        if (res) {
          this.savePick(res.imageUrl);
        } else {
          console.log('no hay respuesta');
        }
      })
    );
  }

  uploadPictureForo(file: File, idForum: number): Observable<any> {
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/forum/photo/upload/${idForum}`, fd).pipe(
      tap((res: any) => {
        if (res) {
          console.log('listo');
        } else {
          console.log('no hay respuesta');
        }
      })
    );
  }

  private savePick(url: string) {
    localStorage.setItem('ProfilePick', url);
  }

  private saveToken(token: string): void {
    localStorage.setItem('currentToken', token);

    this.token = token;
  }

  private saveUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.user = user;
  }

  logOutUser(): void {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('ProfilePick');
    this.token = null;
  }

  getToken() {
    this.token = localStorage.getItem('currentToken');

    return this.token;
  }

  getPic() {
    this.picture = localStorage.getItem('ProfilePick');
    return this.picture;
  }

  getCurrentUser() {
    let user;
    user = localStorage.getItem('currentUser');
    return user;
  }

  logOut() {
    localStorage.removeItem('currentToken');
    localStorage.removeItem('currentUser');
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/all`);
  }

  getAllCategoriesContent(): Observable<any> {
    return this.http.get(`${this.url}/category/all/content`);
  }

  getSubcategoryByCategory(idCategory: number): Observable<any> {
    return this.http.get(`${this.url}/sub-category/category/${idCategory}`);
  }

  getAllForums({
    selectedIdCategory = null,
    selectedIdSubcategory = null,
    searchTerm = '',
    currentPage = 1,
  }): Observable<any> {
    //let token = localStorage.getItem('currentToken');
    return this.http.get(
      `${this.url}/forum/all?page=${currentPage}${
        searchTerm ? `&searchTerm=${searchTerm}` : ''
      }${selectedIdCategory ? `&idCategory=${selectedIdCategory}` : ''}${
        selectedIdSubcategory ? `&idSubcategory=${selectedIdSubcategory}` : ''
      }`
    );
  }

  getForumsBySubcategory(
    idSubcategory: number,
    currentPage: number = 1
  ): Observable<any> {
    return this.http.get(
      `${this.url}/forum/subcategory/${idSubcategory}?page=${currentPage}`
    );
  }

  getForumsById(idForum: number): Observable<any> {
    return this.http.get(`${this.url}/forum/${idForum}`);
  }

  getCategoryById(idCategory: number): Observable<any> {
    return this.http.get(`${this.url}/category/${idCategory}`);
  }

  getSubCategoryById(idSubCategory: number): Observable<any> {
    return this.http.get(`${this.url}/sub-category/${idSubCategory}`);
  }

  getFavoriteSubCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/favorites`);
  }

  getFavoritesForums(idSubCategory: number): Observable<any> {
    return this.http.get(
      `${this.url}/forum/favorites/sub-category/${idSubCategory}`
    );
  }

  getCategoriesWSubcategories(currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/category/all/with/subcategories?page=${currentPage}`
    );
  }

  getSubcategoriesWCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/admin/all/subcategories`);
  }

  saveFavoriteSubCategoria(subcategoryId: any) {
    return this.http.patch(`${this.url}/sub-category/add/favorite`, [
      { id: subcategoryId },
    ]);
  }

  dislikeSubcategorie(id: number) {
    return this.http.patch(`${this.url}/sub-category/dislike/${id}`, []);
  }

  // Servicios de los Posts
  getPostByForumId(idForum: number, currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/post/all/forum/${idForum}?page=${currentPage}`
    );
  }

  getLatestPosts(idPost: number): Observable<any> {
    return this.http.get(`${this.url}/post/latest/${idPost}`);
  }

  likePost(idPost: number): Observable<any> {
    return this.http.patch(`${this.url}/post/like/${idPost}`, []);
  }

  dislikePost(idPost: number): Observable<any> {
    return this.http.patch(`${this.url}/post/dislike/${idPost}`, []);
  }

  postComment(text: string, idForum: number) {
    return this.http.post(`${this.url}/post/publish/forum/${idForum}`, {
      text,
    });
  }

  DeletePost(idPost: number) {
    alert('Se eliminará el comentario del foro');
    return this.http.delete(`${this.url}/post/delete/${idPost}`);
  }

  // Servicios de los Forums

  likeForum(idForum: number): Observable<any> {
    return this.http.patch(`${this.url}/forum/like/${idForum}`, []);
  }

  dislikeForum(idForum: number): Observable<any> {
    return this.http.patch(`${this.url}/forum/dislike/${idForum}`, []);
  }

  createForum(idSub: number, title: string) {
    return this.http.post(`${this.url}/forum/create/${idSub}`, { title });
  }
  //Servicios User
  getForumsPostsByUser(): Observable<any> {
    return this.http.get(`${this.url}/forum/user/posts`);
  }
  getNotSubscribedByUser(): Observable<any> {
    return this.http.get(`${this.url}/forum/user/notSubscribe/posts`);
  }
  getForumCreated(): Observable<any> {
    return this.http.get(`${this.url}/forum/created/user`);
  }

  becomePremium(): Observable<any> {
    return this.http.patch(`${this.url}/user/premium/activate`, []).pipe(
      tap((res: any) => {
        if (res) {
          console.log(res);
          this.saveUser(res.user);
        } else {
          console.log('no hay respuesta');
        }
      })
    );
  }
  //Servicios content category

  getAllContentCategory(): Observable<any> {
    return this.http.get(`${this.url}/content-category/all`);
  }

  getContentCategory(id: number): Observable<any> {
    return this.http.get(`${this.url}/content-category/category/${id}`);
  }

  CreateContent(
    id: number,
    title: string,
    text: string,
    link: string
  ): Observable<any> {
    return this.http.post(
      `${this.url}/content-category/create/category/${id}`,
      { text, title, link }
    );
  }

  SavePicContent(id: number, files: File[]) {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(
      `${this.url}/content-category/photo/upload/${id}`,
      fd
    );
  }

  statusContent(id: number): Observable<any> {
    return this.http.patch(`${this.url}/content-category/change/status/${id}`, []);
  }

  updateContent(
    id: number,
    title: string,
    text: string,
    link: string
  ): Observable<any> {
    console.log(id, title, text, link);
    return this.http.post(`${this.url}/content-category/update/${id}`, {
      text,
      title,
      link,
    });
  }

  updatePicContent(id: number, files: File[]) {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(
      `${this.url}/content-category/photo/upload/${id}`,
      fd
    );
  }

  //recuperar password

  generateLink(email: string): Observable<any> {
    return this.http.post(`${this.url}/user/generate/passwordURL`, { email });
  }

 resetPassword(token, password):Observable<any>{
  return this.http.post(`${this.url}/user/reset/password?token=${token}`, {password });
}

  //CRUD category
  
  CreateCategory(
    name: string,
    text: string,
  ): Observable<any> {
    return this.http.post(
      `${this.url}/category/admin/create`,
      { name, text }
    );
  }

  updateCategory(id: number, name: string, text: string): Observable<any>{
      return this.http.post(`${this.url}/category/update/${id}`, {
        name,
        text  
      });

    }

  updatePicCategory(id: number, files: File[]): Observable<any> {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(
      `${this.url}/category/photo/upload/${id}`,
      fd
    );
  }

  stateCategory(id: number): Observable<any> {
    return this.http.patch(`${this.url}/category/change/status/${id}`, []);
  }

  //CRUD subcategory
  
  CreateSubCategory(
    name: string,
    text: string,
    category:number
  ): Observable<any> {
    return this.http.post(
      `${this.url}/sub-category/admin/create`,
      { name, text, category }
    );
  }


  updatePicSubCategory(id: number, files: File[]): Observable<any> {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/sub-category/photo/upload/${id}`,
      fd
    );
  }

  stateSubCategory(id: number): Observable<any> {
    return this.http.patch(`${this.url}/sub-category/change/status/${id}`, []);
  }

  updateSubcategory(id: number, name: string, text: string): Observable<any>{
    return this.http.post(`${this.url}/sub-category/update/${id}`, {
      name,
      text  
    });
  }

}
