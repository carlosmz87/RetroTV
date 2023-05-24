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


const routes: Routes = [
  {
    path: '',
    component: VistaInicioComponent,
    pathMatch: 'full'
    
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
    component: VistaAboutComponent,
    canActivate: [RoleGuard],
    data: {
      roleDisponible: ['ADMINISTRADOR','USUARIO']
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
