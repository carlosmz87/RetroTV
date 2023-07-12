import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoInterface } from '../modelos/contenido/gestion-videos.interface';
import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { SuscripcionActivaInterface } from '../modelos/contenido/suscripcion-activa.interface';


@Component({
  selector: 'app-vista-reproductor-videos',
  templateUrl: './vista-reproductor-videos.component.html',
  styleUrls: ['./vista-reproductor-videos.component.css']
})
export class VistaReproductorVideosComponent implements OnInit{
  @ViewChild('media', { static: true })
  media!: ElementRef;
  suscripcion!:boolean;
  id_obj!:SuscripcionActivaInterface;
  video: VideoInterface = { nombre: '', fecha: '', resena: '', duracion: '', clasificacion: '', portada: '', video_url: '' };
  constructor(private router:Router, private authService:ServicioAuthService, private route: ActivatedRoute, private servicio_contenido:ServicioGestionContenidoService, private servicio_generico: ServicioGenericosService){}
  ngOnInit(){
    this.authService.userId$.subscribe(
      response => {
        this.id_obj = {
          "id":response
        }
      }
    )
    
    this.servicio_contenido.IsSubscriptionActive(this.id_obj).subscribe(
      response => {
        console.log(response.suscripcion);
        if(response.suscripcion == "ACTIVO"){
          this.route.params.subscribe(params => {
            const id = params['id']; // 'id' es el nombre del parámetro en tu ruta
            
            const id_obj = { id: id }
            // Realiza la solicitud HTTP para obtener los datos del video
            this.servicio_contenido.ObternerVideo(id_obj).subscribe(
              response => {
                if (response.status === 'success' && response.data) {
                  this.video = response.data;
                  // Asigna los datos al objeto video
                   // Crea la etiqueta source
                  const sourceElement = document.createElement('source');
                  sourceElement.src = this.video.video_url;
                  sourceElement.type = 'video/mp4';
                  // Asocia la etiqueta source al elemento video
                  this.media.nativeElement.appendChild(sourceElement);
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
        }else{
          this.router.navigate(['/suscripciones']);
        }
      }
    );   
  }
}
