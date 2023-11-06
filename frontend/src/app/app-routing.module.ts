import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuloPrincipalModule } from './componentes/principal/modulo-principal.module';
import { ModuloLoginModule } from './componentes/login/modulo-login.module';
import { ModuloRegistroModule } from './componentes/registro/modulo-registro.module';
import { VistaRegistroComponent } from './componentes/registro/vistas/vista-registro.component';
import { VistaLoginComponent } from './componentes/login/vistas/vista-login.component';
import { VistaInicioComponent } from './componentes/principal/vistas/vista-inicio.component';
import { VistaRecuperarComponent } from './componentes/login/vistas/vista-recuperar.component';
import { VistaAboutComponent } from './componentes/principal/vistas/vista-about.component';
import { VistaSuscripcionesComponent } from './componentes/principal/vistas/vista-suscripciones.component';
import { UnauthorizedComponent } from './componentes/genericos/unauthorized/unauthorized.component';
import { RoleGuard } from './role.guard';
import { VistaDashboardComponent } from './componentes/principal/vistas/vista-dashboard.component';
import { VistaPromocionesComponent } from './componentes/principal/vistas/vista-promociones.component';
import { VistaReportesComponent } from './componentes/principal/vistas/vista-reportes.component';
import { VistaGestionContenidoComponent } from './componentes/principal/vistas/vista-gestion-contenido.component';
import { VistaGestionClientesComponent } from './componentes/principal/vistas/vista-gestion-clientes.component';
import { VistaPerfilAdministradorComponent } from './componentes/principal/vistas/vista-perfil-administrador.component';
import { VistaPerfilUsuarioComponent } from './componentes/principal/vistas/vista-perfil-usuario.component';
import { VistaFavoritosComponent } from './componentes/principal/vistas/vista-favoritos.component';
import { VistaCanalesComponent } from './componentes/principal/vistas/vista-canales.component';
import { VistaVideosComponent } from './componentes/principal/vistas/vista-videos.component';
import { VistaAgregarCanalesComponent } from './componentes/principal/vistas/vista-agregar-canales.component';
import { VistaAgregarVideosComponent } from './componentes/principal/vistas/vista-agregar-videos.component';
import { VistaReproductorCanalesComponent } from './componentes/principal/vistas/vista-reproductor-canales.component';
import { VistaReproductorVideosComponent } from './componentes/principal/vistas/vista-reproductor-videos.component';
import { VistaClasificacionesComponent } from './componentes/principal/vistas/vista-clasificaciones.component';
import { VistaEditarVideoComponent } from './componentes/principal/vistas/vista-editar-video.component';

const routes: Routes = [
  {
    path: '',
    component: VistaInicioComponent,
    pathMatch: 'full'
    
  },
  {
    path: 'clasificaciones/:clasificacion',
    component: VistaClasificacionesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'canales',
    component: VistaCanalesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'canales/:id',
    component: VistaReproductorCanalesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'videos',
    component: VistaVideosComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'videos/:id',
    component: VistaReproductorVideosComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'edit-video/:id',
    component: VistaEditarVideoComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'registro',
    component: VistaRegistroComponent
  },
  {
    path: 'login',
    component:  VistaLoginComponent
  },
  {
    path: 'recuperar',
    component: VistaRecuperarComponent
  },
  {
    path: 'about',
    component: VistaAboutComponent
  },
  {
    path: 'favoritos',
    component: VistaFavoritosComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO', 'ADMINISTRADOR']
    }
  },
  {
    path: 'profile',
    component: VistaPerfilUsuarioComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['USUARIO']
    }
  },
  {
    path: 'admin',
    component: VistaPerfilAdministradorComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'dashboard',
    component: VistaDashboardComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'gestion-contenido',
    component: VistaGestionContenidoComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'gestion-clientes',
    component: VistaGestionClientesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'promociones',
    component: VistaPromocionesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'reportes',
    component: VistaReportesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'agregar-videos',
    component: VistaAgregarVideosComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'agregar-canales',
    component: VistaAgregarCanalesComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR']
    }
  },
  {
    path: 'suscripciones',
    component: VistaSuscripcionesComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  { 
    path: '**',
    redirectTo: ''
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    ModuloPrincipalModule,
    ModuloLoginModule,
    ModuloRegistroModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
