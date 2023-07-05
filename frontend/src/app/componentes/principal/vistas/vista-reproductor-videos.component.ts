import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoInterface } from '../modelos/contenido/gestion-videos.interface';
import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';


@Component({
  selector: 'app-vista-reproductor-videos',
  templateUrl: './vista-reproductor-videos.component.html',
  styleUrls: ['./vista-reproductor-videos.component.css']
})
export class VistaReproductorVideosComponent implements OnInit{
  video: VideoInterface = { nombre: '', fecha: '', resena: '', duracion: '', clasificacion: '', portada: '', video_url: '' };
  constructor(private route: ActivatedRoute, private servicio_contenido:ServicioGestionContenidoService, private servicio_generico: ServicioGenericosService){}
  ngOnInit(){
    this.route.params.subscribe(params => {
      const id = params['id']; // 'id' es el nombre del parámetro en tu ruta
      
      const id_obj = { id: id }
      // Realiza la solicitud HTTP para obtener los datos del video
      this.servicio_contenido.ObternerVideo(id_obj).subscribe(
        response => {
          if (response.status === 'success' && response.data) {
            this.video = response.data; // Asigna los datos al objeto video
            console.log(response);
          } else {
            console.error('Error al obtener los datos del video');
          }
        },
        error => {
          this.servicio_generico.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
        }
      );
    });
  }
}
