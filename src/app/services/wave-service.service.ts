import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class WaveServiceService {
  url = 'https://wave-service.herokuapp.com';

  public token: string;
  public picture: string;
  public user: any;
  private previousUrl: string;
  private currentUrl: string;
  private authSubject = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService,
    private loc: Location
  ) {
    this.currentUrl = this.router.url;
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    this.loc.back();
  }

  /**Metodo del servicio que hace http request para verificar el auth del email y password suministrados,
   *en caso de existir la respuesta llama al metodo que guarda el token en una cookie
   *@param email
   *@param password
   *@returns Observable
   */
  loginUser(email: String, password: String): Observable<any> {
    return this.http
      .post<any>(`${this.url}/user/login`, { email, password })
      .pipe(
        tap((res: any) => {
          if (res) {
            console.log(res);
            this.saveToken(res.accessToken);
            this.setCurrentRole(res.user.role);
          } else {
            console.log('no hay respuesta');
          }
        })
      );
  }

  /**Metodo del servicio que hace http request para registrar un usuario nuevo con sus datos,
   en caso de no haber error llama al metodo que guarda el token en una cookie
  
    *@param firstName
    *@param lastName
    *@param userName
    *@param email
    *@param birthday
    *@param password
    *@param role
   *@param password
   *@returns Observable
  */

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
            this.setCurrentRole(res.userCreated.role);
          } else {
            console.log('no hay respuesta');
          }
        })
      );
  }

  /**Metodo del servicio que hace http request para recuperar el usuario
    @returns Observable
  */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.url}/user/current`);
  }

  /**Metodo del servicio que recupera el role que se encuentra guardado en una cookie
   *@returns string
   */
  getCurrentRole(): string {
    return this.cookieService.get('userRole');
  }

  /**Metodo del servicio recibe el role para guardarla en una cookie
  @returns void
  */
  setCurrentRole(role): void {
    this.cookieService.set('userRole', role);
  }

  /**Metodo del servicio que hace http request para obtener los foros
   * @returns Observable
   */
  getAllForumsAdmin(): Observable<any> {
    return this.http.get(`${this.url}/category/admin/all/subcategories/forums`);
  }

  /**Metodo del servicio que hace http request para registrar un admin nuevo, solo podra hacerse con un
 usuario superadmin 
    *@param firstName
    *@param lastName
    *@param userName
    *@param email
    *@param birthday
    *@param password
   *@returns Observable
  */
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

  /**recibe como parametro un file que manda en el body del http request,
  del cual recibe como respuesta la url de la imagen guardada en la base de datos... para si guardarla 
  en una cookie mediante el metodo savePick()
  @param file
  @return Observable
  */

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

  /**recibe como parametro un file que manda en el body del http request,
  del cual recibe como respuesta la url de la imagen guardada en la base de datos
  @param file
  @param idForum
  @returns Observable
  */

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

  /**  recibe la url de la imagen como parametro para guardarlo en una cookie 
  @param url
  @return void
  */
  private savePick(url: string) {
    this.cookieService.set('ProfilePick', url);
  }

  /**  recibe el token de auth por JWT como parametro para guardarlo en una cookie 
    * @param token
  @return void
   */
  private saveToken(token: string): void {
    this.cookieService.set('currentToken', token);

    this.token = token;
  }

  /**Elimina todos los datos guardados en cookies para no permitir navegar por la app
  
  @return void
  */

  logOutUser(): void {
    this.cookieService.delete('currentToken');
    this.cookieService.delete('userRole');
    this.cookieService.delete('ProfilePick');
    this.token = null;
  }

  /**Recupera y retorna el token JWT desde una cookie 
  @returns this.token
  */

  getToken() {
    this.token = this.cookieService.get('currentToken');
    return this.token;
  }

  /**Recupera y retorna la foto de perfil desde una cookie
   *  @return this.picture
   */
  getPic() {
    this.picture = this.cookieService.get('ProfilePick');
    return this.picture;
  }

  /**Elimina todos los datos guardados en cookies para no permitir navegar por la app (caso admins)
  @returns void
  */
  logOut() {
    this.cookieService.delete('userRole');
    this.cookieService.delete('currentToken');
  }

  /**Retorna todas las categorias recuperadas de la base de datos mediante una peticion http
   *
   *@returns Observable
   */
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/all`);
  }

  /**Retorna todas las categorias con su contenido recuperadas
   * desde la base de datos mediante una peticion http
   *  @returns Observable*/
  getAllCategoriesContent(): Observable<any> {
    return this.http.get(`${this.url}/category/all/content`);
  }

  /**Retorna todas las subcategorias por el id de la categoria recibida como parametro,
   *  recuperadas desde la base de datos mediante una peticion http
   * @param idCategory
   * @returns Observable
   * */
  getSubcategoryByCategory(idCategory: number): Observable<any> {
    return this.http.get(`${this.url}/sub-category/category/${idCategory}`);
  }

  /**Retorna todos los foros, recuperados desde la base de datos mediante una peticion http,
   * paginandolos y filtrandolos por los parametros recibidos
   * @param selectedIdCategory
   * @param selectedIdSubcategory
   * @param searchTerm
   * @param currentPage
   * @returns Observable
   */

  getAllForums({
    selectedIdCategory = null,
    selectedIdSubcategory = null,
    searchTerm = '',
    currentPage = 1,
  }): Observable<any> {
    return this.http.get(
      `${this.url}/forum/all?page=${currentPage}${
        searchTerm ? `&searchTerm=${searchTerm}` : ''
      }${selectedIdCategory ? `&idCategory=${selectedIdCategory}` : ''}${
        selectedIdSubcategory ? `&idSubcategory=${selectedIdSubcategory}` : ''
      }`
    );
  }

  /**Retorna todos los foros de la subcategoria identificada por el id recibido como parametro,
   *  recuperados desde la base de datos mediante una peticion http,
   * paginados en el back.
   * @param idSubcategory
   * @param idSubcategory
   * @returns Observable
   */

  getForumsBySubcategory(
    idSubcategory: number,
    currentPage: number = 1
  ): Observable<any> {
    return this.http.get(
      `${this.url}/forum/subcategory/${idSubcategory}?page=${currentPage}`
    );
  }

  /**Retorna el foro identificado por el id recibido como parametro,
   *  recuperado desde la base de datos mediante una peticion http al backend.
   * @param idForum
   * @returns Observable
   */

  getForumsById(idForum: number): Observable<any> {
    return this.http.get(`${this.url}/forum/${idForum}`);
  }

  /**Retorna la categoria identificada por el id recibido como parametro,
   *  recuperada desde la base de datos mediante una peticion http al backend.
   * @param idCategory
   * @returns Observable
   */
  getCategoryById(idCategory: number): Observable<any> {
    return this.http.get(`${this.url}/category/${idCategory}`);
  }

  /**Retorna la subcategoria identificada por el id recibido como parametro,
   *  recuperada desde la base de datos mediante una peticion http al backend.
   * @param idSubCategory
   * @returns Observable
   */

  getSubCategoryById(idSubCategory: number): Observable<any> {
    return this.http.get(`${this.url}/sub-category/${idSubCategory}`);
  }

  /**Retorna las subcategorias a las que el usuario le dio like,
   *  recuperadas desde la base de datos mediante una peticion http al backend.
   
   * @returns Observable
  */

  getFavoriteSubCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/favorites`);
  }

  /**Retorna los foros a los que el usuario le dio like,
   *  recuperados desde la base de datos mediante una peticion http al backend.
   * @param idSubcategory
   * @param currentPage
   * @param currentPage2
   * @returns Observable
   */

  getFavoritesForums(
    idSubCategory: number,
    currentPage: number,
    currentPage2: number
  ): Observable<any> {
    return this.http.get(
      `${this.url}/forum/favorites/sub-category/
      ${idSubCategory}?pageFavorites=${currentPage}&pageNotFavorites=${currentPage2}`
    );
  }

  /**Retorna las categorias paginadas con sus respectivas subcategorias,
   *  recuperadas desde el backend mediante una peticion http.
   * @param currentPage
   * @returns Observable
   */

  getCategoriesWSubcategories(currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/category/all/with/subcategories?page=${currentPage}`
    );
  }

  /**Retorna las categorias paginadas con sus respectivas subcategorias,
   *  recuperadas desde la base de datos mediante una peticion http al backend.
  
   * @returns Observable
  */
  getSubcategoriesWCategories(): Observable<any> {
    return this.http.get(`${this.url}/category/admin/all/subcategories`);
  }
  /**Recibe como parametro el id de la subcategoria que se quiere añadir como favorita0y la manda en el body
   * de un http request para que el backend la registre en la base de datos
   * @param subCategoryId
   * @returns Observable
   */

  saveFavoriteSubCategoria(subcategoryId: any) {
    return this.http.patch(`${this.url}/sub-category/add/favorite`, [
      { id: subcategoryId },
    ]);
  }

  /**Recibe como parametro el id de la subcategoria que se quiere eliminar de la lista de
   * favoritos y la manda en el body
   * de un http request para que el backend haga lo correspondiente en la base de datos
   * @param id
   * @returns Observable
   */

  dislikeSubcategorie(id: number) {
    return this.http.patch(`${this.url}/sub-category/dislike/${id}`, []);
  }

  /**  Retorna todos los posts paginados del foro identificado por el id recibido como parametro
  @param idForum
  @param currentPage
  @returns Observable
  */
  getPostByForumId(idForum: number, currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/post/all/forum/${idForum}?page=${currentPage}`
    );
  }

  /**Retorna los ultimos posts realizados en el foro identificado por el id recibido
   * @param idPost
   * @returns Observable
   */
  getLatestPosts(idPost: number): Observable<any> {
    return this.http.get(`${this.url}/post/latest/${idPost}`);
  }

  /**Recibe como parametro el id del post al que el user quiere darle like, y lo manda al back anexado al endpoint
   * para que quede registrado en la base de datos
   * @param idPost
   * @returns Observable
   */

  likePost(idPost: number): Observable<any> {
    return this.http.patch(`${this.url}/post/like/${idPost}`, []);
  }

  /**Recibe como parametro el id del post al que el user quiere darle dislike, y lo manda al back anexado al endpoint
   * para que quede registrado en la base de datos
   * @param idPost
   * @returns Observable
   */

  dislikePost(idPost: number): Observable<any> {
    return this.http.patch(`${this.url}/post/dislike/${idPost}`, []);
  }

  /**Recibe como parametro el id del foro y el texto que se quiero postear, manda el id anexado al endpoint
   * y el texto en el body de la peticion http, para que quede registrado en la base de datos
   * @param text
   * @param idForum
   * @returns Observable
   */

  postComment(text: string, idForum: number) {
    return this.http.post(`${this.url}/post/publish/forum/${idForum}`, {
      text,
    });
  }

  /**Recibe como parametro el id del post al que el user quiere eliminar, y lo manda al back anexado al endpoint
   * para que se elimine en la base de datos
   * @param idPost
   * @returns Observable
   */
  DeletePost(idPost: number) {
    alert('Se eliminará el comentario del foro');
    return this.http.delete(`${this.url}/post/delete/${idPost}`);
  }

  /**Recibe como parametro el id del foro al que el user quiere darle like, y lo manda al back anexado al endpoint
   * para que quede registrado en la base de datos
   * @param idForum
   * @returns Observable
   */

  likeForum(idForum: number): Observable<any> {
    return this.http.patch(`${this.url}/forum/like/${idForum}`, []);
  }

  /**Recibe como parametro el id del foro al que el user ya no quiere suscribirse, y lo manda al back anexado al endpoint
   * para que quede registrado en la base de datos
   * @param idForum
   * @returns Observable
   */
  dislikeForum(idForum: number): Observable<any> {
    return this.http.patch(`${this.url}/forum/dislike/${idForum}`, []);
  }

  /**Recibe como parametro el id de la subcategoria en donde se quiere crear un foro, y el titulo del mismo, manda el id anexado al endpoint
   * y el titulo del foro en el body, para que este ultimo quede registrado en la base de datos
   *@param idSub
   *@param title
   * @returns Observable
   */
  createForum(idSub: number, title: string) {
    return this.http.post(`${this.url}/forum/create/${idSub}`, { title });
  }

  /**Retorna los posts creados por el user
   * @returns Observable
   * */
  getForumsPostsByUser(): Observable<any> {
    return this.http.get(`${this.url}/forum/user/posts`);
  }

  /**Retorna los posts creados por el user en los foros a los que no esta suscrito
   * @returns Observableo*/
  getNotSubscribedByUser(): Observable<any> {
    return this.http.get(`${this.url}/forum/user/notSubscribe/posts`);
  }

  /**Retorna los foros creados por el user
   * @returns Observable
   * */
  getForumCreated(): Observable<any> {
    return this.http.get(`${this.url}/forum/created/user`);
  }

  /**indica al back que cambie el role del user de normal a premium, luego guarda en una cookie el nuevo role
   
   * @returns Observable
  */
  becomePremium(): Observable<any> {
    return this.http.patch(`${this.url}/user/premium/activate`, []).pipe(
      tap((res: any) => {
        if (res) {
          console.log(res);
          this.cookieService.set('userRole', res.user.role);
        } else {
          console.log('no hay respuesta');
        }
      })
    );
  }

  /**Retorna todos los contenidos de las categorias
   * @returns Observable
   */
  getAllContentCategory(): Observable<any> {
    return this.http.get(`${this.url}/content-category/all`);
  }

  /**Retorna el contenido de categoria identificado por el id recibido como parametro */
  getContentCategory(id: number): Observable<any> {
    return this.http.get(`${this.url}/content-category/category/${id}`);
  }

  /**Crea contenido en la categoria identificada por el id recibido como parametro, mandando en el body
   * de la peticion http los datos necesario para ese fin
   */
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

  /**recibe como parametros el id del content category y el file de la imagen que se quiere anexar al mismo para
   * enviarlos al back mediante una peticion http para que quede registrado en la base de datos
   */

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

  /**Cambia el estado de activo a inactivo, o viceversa, del contenido de categoria identificado por el id recibido como parametro */
  statusContent(id: number): Observable<any> {
    return this.http.patch(
      `${this.url}/content-category/change/status/${id}`,
      []
    );
  }

  /**Edita o actualiza el contenido de categoria identificado por el id recibido como parametro, con los nuevos datos
   * recibidos, mandandolos al backend mediante una peticion http
   */
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

  /**Actualiza la foto del contenido de categoria identificada por el id recibido, con un nuevo file
   * @param id
   * @param file
   * @returns Observable
   */
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

  /**recibe un email como parametro, y lo pasa al back en el body de una peticion htttp para que desde alli se envie un correo
   * con el link de recuperacion de contraseña
   * @param email
   * @returns observable
   */

  generateLink(email: string): Observable<any> {
    return this.http.post(`${this.url}/user/generate/passwordURL`, { email });
  }

  /**Recibe como parametro el token recuperado del query string recibido en el link enviado desde el backend al
   * usuario ademas de la nueva contraseña para terminar el proceso de recuperacion de la misma
   * @param token
   * @param password
   * @returns observable
   */
  resetPassword(token, password): Observable<any> {
    return this.http.post(`${this.url}/user/reset/password?token=${token}`, {
      password,
    });
  }

  /**Recibe como parametro los datos necesarios para la creacion de una categoria y retorna la respuesta
   * del back a la peticion http
   * @param name
   * @param text
   * @returns Observable
   */

  CreateCategory(name: string, text: string): Observable<any> {
    return this.http.post(`${this.url}/category/admin/create`, { name, text });
  }

  /**Edita o actualiza la categoria identificada por el id recibido como parametro, con los nuevos datos
   * recibidos, mandandolos al backend mediante una peticion http para registrarlo en la base de datos
   * @param id
   * @param name
   * @param text
   * @returns Observable
   */

  updateCategory(id: number, name: string, text: string): Observable<any> {
    return this.http.post(`${this.url}/category/update/${id}`, {
      name,
      text,
    });
  }
  /**Actualiza la foto de la categoria identificada por el id recibidocomo parametro, con un nuevo file
   * @param id
   * @param files
   * @returns Observable
   */
  updatePicCategory(id: number, files: File[]): Observable<any> {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/category/photo/upload/${id}`, fd);
  }

  /**Cambia el estado de activo a inactivo, o viceversa, de la categoria identificada por el id recibido como parametro
   * @param id
   * @returns Observable
   */
  stateCategory(id: number): Observable<any> {
    return this.http.patch(`${this.url}/category/change/status/${id}`, []);
  }

  /**Recibe como parametro los datos necesarios para la creacion de una subcategoria y retorna la respuesta
   * del back a la peticion http
   * @param name
   * @param text
   * @param category
   * @returns Observable
   */
  CreateSubCategory(
    name: string,
    text: string,
    category: number
  ): Observable<any> {
    return this.http.post(`${this.url}/sub-category/admin/create`, {
      name,
      text,
      category,
    });
  }

  /**Actualiza la foto de la subcategoria identificada por el id recibido como parametro,
   *  con un nuevo file
   * @param id
   * @param files
   * @returns Observable*/

  updatePicSubCategory(id: number, files: File[]): Observable<any> {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/sub-category/photo/upload/${id}`, fd);
  }

  /**Cambia el estado de activo a inactivo, o viceversa, de la subcategoria identificada por el id recibido como parametro
   * @param id
   * @returns Observable
   */
  stateSubCategory(id: number): Observable<any> {
    return this.http.patch(`${this.url}/sub-category/change/status/${id}`, []);
  }

  /**Edita o actualiza la subcategoria identificada por el id recibido como parametro, con los nuevos datos
   * recibidos, mandandolos al backend mediante una peticion http para registrarlo en la base de datos
   *  @param id
   * @param name
   * @param text
   * @returns Observable
   */

  updateSubcategory(id: number, name: string, text: string): Observable<any> {
    return this.http.post(`${this.url}/sub-category/update/${id}`, {
      name,
      text,
    });
  }

  /**Cambia el estado de activo a inactivo, o viceversa, del foro identificado por el id recibido
   * como parametro
   * * @param id
   * @returns Observable
   * */
  statusForo(id: number): Observable<any> {
    return this.http.patch(`${this.url}/forum/change/status/${id}`, []);
  }

  /**Recibe como parametro los datos necesarios para la creacion de un foro y retorna la respuesta
   * del back a la peticion http, que esta protegida por un guard y que solo puese ser usado por admins
   * * @param subcategory
   * @param title
   * @returns Observable
   */
  createForumByAdmin(subcategory: number, title: string): Observable<any> {
    return this.http.post(`${this.url}/forum/admin/create`, {
      subcategory,
      title,
    });
  }

  /**Actualiza la foto del foro identificado por el id recibido como parametro,
   *  con un nuevo file
   * @param id
   * @param files
   * @returns Observable */
  updatePicForum(id: number, files: File[]): Observable<any> {
    console.log(files[0]);
    let file = files[0];
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post(`${this.url}/forum/photo/upload/${id}`, fd);
  }

  /**Edita o actualiza el foro identificado por el id recibido como parametro, con el nuevo texto
   * recibido, mandandolo al backend mediante una peticion http para registrarlo en la base de datos
   *@param id
   * @param title
   * @returns Observable
   */
  updateForum(id: number, title: string): Observable<any> {
    return this.http.post(`${this.url}/forum/update/${id}`, {
      title,
    });
  }

  /**Recibe como parametro un subscription object que se manda al backend mediante una peticion
   * para enviarle push notifications
   * @param sub
   * @returns Observable
   */

  addPushSubscriber(sub: any): Observable<any> {
    let endpoint = sub.endpoint;
    let encriptionKey = sub.keys.p256dh;
    let authSecret = sub.keys.auth;
    console.log(endpoint, encriptionKey, authSecret);

    return this.http.put(`${this.url}/subscriber/new`, {
      endpoint,
      encriptionKey,
      authSecret,
    });
  }

  /**Devuelve todos los usuarios normales y premium registrados en la base de datos de forma paginada
   * mediante una peticion http al backend
   * @param currentPage
   * @returns Observable
   * */
  getAdmins(currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/user/admin/readAdminUsers?page=${currentPage}`
    );
  }

  /**Devuelve todos los usuarios admins y superadmins registrados en la base de datos de forma paginada
   * mediante una peticion http al backend
   *@param currentPage
   * @returns Observable
   * */
  getNormalUsers(currentPage: number = 1): Observable<any> {
    return this.http.get(
      `${this.url}/user/admin/readNormalUsers?page=${currentPage}`
    );
  }

  /**Edita o actualiza el user, con los nuevos datos recibidos como parametros
   *, mandandolos al backend mediante una peticion http para registrarlo en la base de datos
   * @param firstName
   *  @param lastName
   *  @param userName
   * @returns Observable
   */
  editProfile(
    firstName: string,
    lastName: string,
    userName: string
  ): Observable<any> {
    return this.http.patch(`${this.url}/user/profile/edit`, {
      firstName,
      lastName,
      userName,
    });
  }

  /**Cambia el estado de activo a inactivo, o viceversa, del user (admin) identificado por el email recibido
   * como parametro
   *  @param email
   * @returns Observable
   * */
  statusAdmin(email: string): Observable<any> {
    return this.http.patch(`${this.url}/user/superadmin/activate/admin`, {
      email,
    });
  }

  /**Cambia el estado de activo a inactivo, o viceversa, del user (normal o premium) identificado por el email recibido
   * como parametro
   *  @param email
   * @returns Observable
   * */
  statusNormal(email: string): Observable<any> {
    return this.http.patch(`${this.url}/user/admin/activate/normal`, { email });
  }
}
