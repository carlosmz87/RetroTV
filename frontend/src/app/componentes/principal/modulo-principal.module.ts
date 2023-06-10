import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VistaPrincipalComponent } from './vistas/vista-principal.component';
import { ModuloGenericosModule } from '../genericos/modulo-genericos.module';
import { RouterModule } from '@angular/router';
import { VistaInicioComponent } from './vistas/vista-inicio.component';
import { VistaAboutComponent } from './vistas/vista-about.component';
import { VistaSuscripcionesComponent } from './vistas/vista-suscripciones.component';
import {MatButtonModule} from '@angular/material/button';
import { VistaDashboardComponent } from './vistas/vista-dashboard.component';
import { VistaPromocionesComponent } from './vistas/vista-promociones.component';
import { VistaReportesComponent } from './vistas/vista-reportes.component';
import { VistaGestionContenidoComponent } from './vistas/vista-gestion-contenido.component';
import { VistaGestionClientesComponent } from './vistas/vista-gestion-clientes.component';
import { VistaPerfilUsuarioComponent } from './vistas/vista-perfil-usuario.component';
import { VistaPerfilAdministradorComponent } from './vistas/vista-perfil-administrador.component';
import { VistaFavoritosComponent } from './vistas/vista-favoritos.component';
import { VistaVideosComponent } from './vistas/vista-videos.component';
import { VistaCanalesComponent } from './vistas/vista-canales.component';
import { ServicioGestionClientesService } from './servicios/clientes/servicio-gestion-clientes.service';
import { ServicioGestionContenidoService } from './servicios/contenido/servicio-gestion-contenido.service';
import { ServicioClasificacionService } from './servicios/clasificacion/servicio-clasificacion.service';
import { ServicioAuthService } from '../login/servicios/servicio-auth.service';
import { ServicioGenericosService } from '../genericos/servicios/servicio-genericos.service';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VistaAgregarVideosComponent } from './vistas/vista-agregar-videos.component';
import { VistaAgregarCanalesComponent } from './vistas/vista-agregar-canales.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    VistaPrincipalComponent,
    VistaInicioComponent,
    VistaAboutComponent,
    VistaSuscripcionesComponent,
    VistaDashboardComponent,
    VistaPromocionesComponent,
    VistaReportesComponent,
    VistaGestionContenidoComponent,
    VistaGestionClientesComponent,
    VistaPerfilUsuarioComponent,
    VistaPerfilAdministradorComponent,
    VistaFavoritosComponent,
    VistaVideosComponent,
    VistaCanalesComponent,
    VistaAgregarVideosComponent,
    VistaAgregarCanalesComponent
  ],
  imports: [
    CommonModule,
    ModuloGenericosModule,
    RouterModule,
    MatButtonModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    VistaPrincipalComponent,
    VistaInicioComponent,
    VistaAboutComponent,
    VistaSuscripcionesComponent,
    VistaDashboardComponent,
    VistaPromocionesComponent,
    VistaReportesComponent,
    VistaGestionClientesComponent,
    VistaGestionContenidoComponent,
    VistaPerfilUsuarioComponent,
    VistaPerfilAdministradorComponent,
    VistaFavoritosComponent,
    VistaVideosComponent,
    VistaCanalesComponent,
    VistaAgregarCanalesComponent,
    VistaAgregarVideosComponent
  ],
  providers: [
    ServicioGestionClientesService,
    ServicioGestionContenidoService,
    ServicioClasificacionService,
    ServicioAuthService,
    ServicioGenericosService
  ]
})
export class ModuloPrincipalModule { }
