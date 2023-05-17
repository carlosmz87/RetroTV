import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPrincipalComponent } from './vistas/vista-principal.component';
import { ModuloGenericosModule } from '../genericos/modulo-genericos.module';
import { RouterModule } from '@angular/router';
import { VistaInicioComponent } from './vistas/vista-inicio.component';
import { VistaAboutComponent } from './vistas/vista-about.component';
import { VistaSuscripcionesComponent } from './vistas/vista-suscripciones.component';

@NgModule({
  declarations: [
    VistaPrincipalComponent,
    VistaInicioComponent,
    VistaAboutComponent,
    VistaSuscripcionesComponent
  ],
  imports: [
    CommonModule,
    ModuloGenericosModule,
    RouterModule
  ],
  exports: [
    VistaPrincipalComponent,
    VistaInicioComponent,
    VistaAboutComponent,
    VistaSuscripcionesComponent
  ]
})
export class ModuloPrincipalModule { }
