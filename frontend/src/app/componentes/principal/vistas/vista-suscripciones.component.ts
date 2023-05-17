import { Component } from '@angular/core';

@Component({
  selector: 'app-vista-suscripciones',
  templateUrl: './vista-suscripciones.component.html',
  styleUrls: ['./vista-suscripciones.component.css']
})
export class VistaSuscripcionesComponent {
  EnviarSolicitudSuscripcion(){
    console.log("SE ENVIARA SOLICITUD DE SUSCRIPCION");
  }
}
