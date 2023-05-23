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
import { HttpClientModule } from '@angular/common/http';
import { ModuloGenericosModule } from '../genericos/modulo-genericos.module';
import { CookieService } from 'ngx-cookie-service';

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
    RouterModule,
    HttpClientModule,
    ModuloGenericosModule
  ],
  exports:[
    VistaLoginComponent,
    VistaRecuperarComponent
  ],
  providers: [
    ServicioLoginService,
    CookieService
  ]
})
export class ModuloLoginModule { }
