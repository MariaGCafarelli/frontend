import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './routing/routing.module';
import { AppComponent } from './app.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { RegistrarUsuarioComponent } from './components/registrar-usuario/registrar-usuario.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MenuComponent } from './components/menu/menu.component';
import { PagoPremiumComponent } from './components/pago-premium/pago-premium.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CambiarContrasenaComponent } from './components/cambiar-contrasena/cambiar-contrasena.component';
import { HomeComponent } from './components/home/home.component';
import { ForosComponent } from './components/foros/foros.component';
import { ForoComponent } from './components/foros/foro/foro.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { SubCategoriaComponent } from './components/categorias/sub-categoria/sub-categoria.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { CategoriaComponent } from './components/categorias/categoria/categoria.component';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { FavoritasComponent } from './components/favoritas/favoritas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ForoFilterPipe } from './pipes/foro-filter.pipe';
import { PictureComponent } from './components/picture/picture.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CrearForoComponent } from './components/foros/crear-foro/crear-foro.component';
import { PictureForoComponent } from './components/picture-foro/picture-foro.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AdminComponent } from './components/admin/admin.component';
import { NavbarComponent } from './components/admin/navbar/navbar.component';
import { ContenidoRecomendadoComponent } from './components/admin/categorias/contenido-recomendado/contenido-recomendado.component';
import { CategoriasAdminComponent } from './components/admin/categorias-admin/categorias-admin.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RegistrarAdminComponent } from './components/admin/registrar-admin/registrar-admin.component';
import { LostPasswordComponent } from './components/lost-password/lost-password.component';
import { SubAdminComponent } from './components/admin/sub-admin/sub-admin.component';

const config: SocketIoConfig = {
  url: 'https://wave-service.herokuapp.com',
  options: {},
};
@NgModule({
  declarations: [
    AppComponent,
    IniciarSesionComponent,
    RegistrarUsuarioComponent,
    InicioComponent,
    MenuComponent,
    PagoPremiumComponent,
    NotFoundComponent,
    CambiarContrasenaComponent,
    HomeComponent,
    CategoriasComponent,
    SubCategoriaComponent,
    ForosComponent,
    ForoComponent,
    CategoriasComponent,
    CategoriaComponent,
    FavoritasComponent,
    ForoFilterPipe,
    PictureComponent,
    UsuarioComponent,
    CrearForoComponent,
    PictureForoComponent,
    DateAgoPipe,
    AdminComponent,
    NavbarComponent,
    ContenidoRecomendadoComponent,
    CategoriasAdminComponent,
    RegistrarAdminComponent,
    LostPasswordComponent,
    SubAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPayPalModule,
    NgbModule,
    NgxSpinnerModule,
    NgxDropzoneModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    SocketIoModule.forRoot(config),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
