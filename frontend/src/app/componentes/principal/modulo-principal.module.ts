import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPrincipalComponent } from './vistas/vista-principal.component';
import { ModuloGenericosModule } from '../genericos/modulo-genericos.module';
import { RouterModule } from '@angular/router';
import { VistaInicioComponent } from './vistas/vista-inicio.component';

@NgModule({
  declarations: [
    VistaPrincipalComponent,
    VistaInicioComponent
  ],
  imports: [
    CommonModule,
    ModuloGenericosModule,
    RouterModule
  ],
  exports: [
    VistaPrincipalComponent,
    VistaInicioComponent
  ]
})
export class ModuloPrincipalModule { }
