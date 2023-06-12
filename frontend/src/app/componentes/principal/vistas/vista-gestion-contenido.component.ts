import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-gestion-contenido',
  templateUrl: './vista-gestion-contenido.component.html',
  styleUrls: ['./vista-gestion-contenido.component.css']
})
export class VistaGestionContenidoComponent {
  constructor(private router:Router){}
}
