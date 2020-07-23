import { ContenidoRecomendadoComponent } from './../components/admin/categorias/contenido-recomendado/contenido-recomendado.component';
import { AdminComponent } from './../components/admin/admin.component';
import { CategoriaComponent } from './../components/categorias/categoria/categoria.component';
import { InicioComponent } from './../components/inicio/inicio.component';
import { RegistrarUsuarioComponent } from './../components/registrar-usuario/registrar-usuario.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IniciarSesionComponent } from '../components/iniciar-sesion/iniciar-sesion.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { CambiarContrasenaComponent } from '../components/cambiar-contrasena/cambiar-contrasena.component';
import { HomeComponent } from '../components/home/home.component';
import { ForosComponent } from '../components/foros/foros.component';
import { ForoComponent } from '../components/foros/foro/foro.component';
import { SubCategoriaComponent } from '../components/categorias/sub-categoria/sub-categoria.component';
import { CategoriasComponent } from '../components/categorias/categorias.component';
import { AuthGuard } from '../guards/auth.guard';
import { PictureComponent } from '../components/picture/picture.component';
import { UsuarioComponent } from '../components/usuario/usuario.component';
import { PictureForoComponent } from '../components/picture-foro/picture-foro.component';
import { CategoriasAdminComponent } from '../components/admin/categorias-admin/categorias-admin.component';
import { RegistrarAdminComponent } from '../components/admin/registrar-admin/registrar-admin.component';
import { LostPasswordComponent } from '../components/lost-password/lost-password.component';
import { AdminGuard } from '../guards/admin.guard';
import { SubAdminComponent } from '../components/admin/sub-admin/sub-admin.component';
import { ForosAdminComponent } from '../components/admin/foros-admin/foros-admin.component';
import { ComentariosComponent } from '../components/admin/foros-admin/comentarios/comentarios.component';
import { UsuariosAdminComponent } from '../components/admin/usuarios-admin/usuarios-admin.component';
import { AdminCrudComponent } from '../components/admin/usuarios-admin/admin-crud/admin-crud.component';

const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'iniciar-sesion', component: IniciarSesionComponent },
  { path: 'reset/password', component: CambiarContrasenaComponent },
  { path: 'registrar-usuario', component: RegistrarUsuarioComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'picture', component: PictureComponent, canActivate: [AuthGuard] },

  {
    path: 'picture-foro/:id',
    component: PictureForoComponent,
    canActivate: [AuthGuard],
  },
  { path: 'cambiar-contrasena', component: LostPasswordComponent },
  {
    path: 'perfil-usuario',
    component: UsuarioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'categoria/:id',
    component: CategoriaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sub-categoria/:id',
    component: SubCategoriaComponent,
    canActivate: [AuthGuard],
  },
  { path: 'foros', component: ForosComponent, canActivate: [AuthGuard] },
  { path: 'foro/:id', component: ForoComponent, canActivate: [AuthGuard] },
  //{ path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
  {
    path: 'admin',
    component: CategoriasAdminComponent,
    canActivate: [AdminGuard],
  },

  {
    path: 'admin/contenido-recomendado',
    component: ContenidoRecomendadoComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/registrar-admin',
    component: RegistrarAdminComponent,
    canActivate: [AdminGuard],
  },

  {
    path: 'admin/contenido-recomendado',
    component: ContenidoRecomendadoComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/subcategorias',
    component: SubAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/foros',
    component: ForosAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/foro/:id/comentarios',
    component: ComentariosComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/usuarios',
    component: UsuariosAdminComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'admin/usuarios-admin',
    component: AdminCrudComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: InicioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
