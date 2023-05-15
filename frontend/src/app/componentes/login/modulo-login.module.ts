import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaLoginComponent } from './vistas/vista-login.component';
import { ServicioLoginService } from './servicios/servicio-login.service';


@NgModule({
  declarations: [
    VistaLoginComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    VistaLoginComponent
  ],
  providers: [
    ServicioLoginService
  ]
})
export class ModuloLoginModule { }
