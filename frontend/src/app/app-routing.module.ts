import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModuloPrincipalModule } from './componentes/principal/modulo-principal.module';
import { ModuloLoginModule } from './componentes/login/modulo-login.module';
import { ModuloRegistroModule } from './componentes/registro/modulo-registro.module';
import { VistaRegistroComponent } from './componentes/registro/vistas/vista-registro.component';
import { VistaLoginComponent } from './componentes/login/vistas/vista-login.component';
import { VistaPrincipalComponent } from './componentes/principal/vistas/vista-principal.component';

const routes: Routes = [
  {
    path: '',
    component: VistaPrincipalComponent,
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
