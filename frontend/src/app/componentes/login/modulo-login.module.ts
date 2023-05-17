import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaLoginComponent } from './vistas/vista-login.component';
import { ServicioLoginService } from './servicios/servicio-login.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { VistaRecuperarComponent } from './vistas/vista-recuperar.component';

@NgModule({
  declarations: [
    VistaLoginComponent,
    VistaRecuperarComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterModule
  ],
  exports:[
    VistaLoginComponent,
    VistaRecuperarComponent
  ],
  providers: [
    ServicioLoginService
  ]
})
export class ModuloLoginModule { }
