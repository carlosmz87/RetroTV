import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RespuestaListaClasificacionInterface } from '../modelos/clasificacion/respuesta-clasificacion.interface';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioClasificacionService } from '../servicios/clasificacion/servicio-clasificacion.service';
import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-vista-agregar-videos',
  templateUrl: './vista-agregar-videos.component.html',
  styleUrls: ['./vista-agregar-videos.component.css']
})
export class VistaAgregarVideosComponent {
  formularioVideos!: FormGroup;
  nombreArchivoPortada: string = '';
  nombreArchivoVideo: string = '';
  portada!: File;
  video!: File;


  constructor(private servicio_contenido:ServicioGestionContenidoService,private fb: FormBuilder, private servicio_genericos:ServicioGenericosService, private servicio_clasificacion:ServicioClasificacionService) {
    
  }

  ngOnInit(){
    this.formularioVideos = this.fb.group({
      nombre: ['', Validators.required],
      fecha: ['', Validators.required],
      resena: ['', Validators.required],
      duracion: ['', Validators.required],
      clasificacion: ['', Validators.required]
    });
    this.LlenarClasificaciones();
  }

  clasificaciones:RespuestaListaClasificacionInterface = {
    status:'',
    RetroTV:'',
    clasificaciones:[]
  }

  AgregarVideo() {
    if (this.formularioVideos.valid && this.portada && this.video) {
      const formData = new FormData();
      formData.append('nombre', this.formularioVideos.value.nombre);
      formData.append('fecha', format(this.formularioVideos.value.fecha, 'yyyy-MM-dd HH:mm:ss'));
      formData.append('resena', this.formularioVideos.value.resena);
      formData.append('duracion', this.formularioVideos.value.duracion);
      formData.append('clasificacion', this.formularioVideos.value.clasificacion);
      formData.append('portada', this.portada);
      formData.append('video', this.video);

      // Enviar petición POST al backend
      this.servicio_contenido.AgregarVideo(formData).subscribe(
        response => {
          this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
          window.location.reload()
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
        }
      )
    }
  }

  onPortadaSelected(event: any): void {
    const file = event.target.files[0];
    this.nombreArchivoPortada = file ? file.name : '';
    this.portada = file;
  }

  onVideoSelected(event: any): void {
    const file = event.target.files[0];
    this.nombreArchivoVideo = file ? file.name : '';
    this.video = file;
  }

  LlenarClasificaciones(){
    this.servicio_clasificacion.ListarClasificaciones().subscribe(
      response => {
        this.clasificaciones.status = response.status,
        this.clasificaciones.RetroTV = response.RetroTV,
        this.clasificaciones.clasificaciones = response.clasificaciones
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }



}
