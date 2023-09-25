import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RespuestaListaClasificacionInterface } from '../modelos/clasificacion/respuesta-clasificacion.interface';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioClasificacionService } from '../servicios/clasificacion/servicio-clasificacion.service';
import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { format } from 'date-fns';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vista-editar-video',
  templateUrl: './vista-editar-video.component.html',
  styleUrls: ['./vista-editar-video.component.css']
})
export class VistaEditarVideoComponent implements OnInit{
  formularioVideos!: FormGroup;
  nombreArchivoPortada: string = '';
  portada!: File;
  @ViewChild('portadaInput') portadaInput!: ElementRef;
  
  constructor(private router:Router, private route:ActivatedRoute, private servicio_contenido:ServicioGestionContenidoService,private fb: FormBuilder, private servicio_genericos:ServicioGenericosService, private servicio_clasificacion:ServicioClasificacionService) {
    
  }

  ngOnInit(){
    const id = Number(this.route.snapshot.params['id']);
    this.GetDataVideo(id)
    this.formularioVideos = this.fb.group({
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

  onPortadaSelected(event: any): void {
    const file = event.target.files[0];
    this.nombreArchivoPortada = file ? file.name : '';
    this.portada = file;
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

  GetDataVideo(id: Number) {
    let data_obj = { 'id': id };
    this.servicio_contenido.ObternerVideo(data_obj).subscribe(
      response => {
        if (response.status === 'success' && response.data) {
          this.formularioVideos.patchValue({
            fecha: response.data.fecha,
            resena: response.data.resena,
            duracion: response.data.duracion,
            clasificacion: response.data.clasificacion,
          });
        } else {
          console.error('Error al obtener los datos del video');
        }

      }
    )
  }

  EditarVideo(){
    if (this.formularioVideos.valid && this.portada) {
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS EDITAR LA INFORMACIÓN DEL VIDEO?');
      if (confirmacion) {
        this.route.params.subscribe(
          params => {
            const formData = new FormData();
            formData.append('fecha', format(this.formularioVideos.value.fecha, 'yyyy-MM-dd HH:mm:ss'));
            formData.append('resena', this.formularioVideos.value.resena);
            formData.append('duracion', this.formularioVideos.value.duracion);
            formData.append('clasificacion', this.formularioVideos.value.clasificacion);
            formData.append('portada', this.portada);
            formData.append('id', params['id'])

            // Enviar petición POST al backend
            this.servicio_contenido.EditarVideoInfo(formData).subscribe(
              response => {
                this.formularioVideos.reset();
                this.nombreArchivoPortada = '';
                this.portadaInput.nativeElement.value = '';
                this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
                this.router.navigate(['/gestion-contenido']);
              },
              error => {
                this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
              }
            )
          }
        )
      }
    }
  }
}
