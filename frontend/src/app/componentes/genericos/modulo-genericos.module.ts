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

@NgModule({
  declarations: [
    CustomFooterComponent,
    CustomHeaderComponent,
    CustomNavbarComponent,
    CustomSidenavComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    RouterModule
  ],
  exports: [
    CustomFooterComponent,
    CustomHeaderComponent,
    CustomNavbarComponent,
    CustomSidenavComponent
  ],
  providers: [
    ServicioGenericosService
  ]
})
export class ModuloGenericosModule { }
