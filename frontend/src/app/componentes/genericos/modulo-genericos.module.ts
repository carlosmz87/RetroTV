import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFooterComponent } from './footer/custom-footer.component';
import { CustomHeaderComponent } from './header/custom-header.component';
import { CustomNavbarComponent } from './navbar/custom-navbar.component';
import { CustomSidenavComponent } from './sidenav/custom-sidenav.component';
import { ServicioGenericosService } from './servicios/servicio-genericos.service';
import {MatMenuModule} from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CustomNotificadorComponent } from './notificador/custom-notificador.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ServicioAuthService } from '../login/servicios/servicio-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CustomFooterComponent,
    CustomHeaderComponent,
    CustomNavbarComponent,
    CustomSidenavComponent,
    CustomNotificadorComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  exports: [
    CustomFooterComponent,
    CustomHeaderComponent,
    CustomNavbarComponent,
    CustomSidenavComponent,
    CustomNotificadorComponent,
    UnauthorizedComponent
  ],
  providers: [
    ServicioGenericosService,
    ServicioAuthService,
    CookieService
  ]
})
export class ModuloGenericosModule { }
