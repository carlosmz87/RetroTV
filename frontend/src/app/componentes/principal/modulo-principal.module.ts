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
    VistaGestionClientesComponent
  ],
  imports: [
    CommonModule,
    ModuloGenericosModule,
    RouterModule,
    MatButtonModule
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
    VistaGestionContenidoComponent
  ]
})
export class ModuloPrincipalModule { }
