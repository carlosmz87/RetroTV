import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaRegistroComponent } from './vistas/vista-registro.component';
import { ServicioRegistroService } from './servicios/servicio-registro.service';



@NgModule({
  declarations: [
    VistaRegistroComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VistaRegistroComponent
  ],
  providers: [
    ServicioRegistroService
  ]
})
export class ModuloRegistroModule { }
