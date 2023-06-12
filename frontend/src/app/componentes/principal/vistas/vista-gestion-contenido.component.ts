import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { VideosInterface } from '../modelos/contenido/gestion-videos.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-vista-gestion-contenido',
  templateUrl: './vista-gestion-contenido.component.html',
  styleUrls: ['./vista-gestion-contenido.component.css']
})
export class VistaGestionContenidoComponent {
  dataSourceVideos!: MatTableDataSource<VideosInterface>;
  displayedColumnsVideos: string[] = ['id', 'nombre', 'fecha', 'resena', 'duracion', 'clasificacion', 'portada','eliminar'];

  @ViewChild(MatPaginator) paginator_videos!: MatPaginator;
  @ViewChild(MatSort) sort_videos!: MatSort;
  

  constructor(private router:Router, private servicio_contenido: ServicioGestionContenidoService, private servicio_genericos:ServicioGenericosService){}

  ngAfterViewInit() {
    if (this.dataSourceVideos) {
      this.dataSourceVideos.paginator = this.paginator_videos;
      this.dataSourceVideos.sort = this.sort_videos;
    }
  }

  ngOnInit(){
    this.LlenarTablaVideos();
  }

  LlenarTablaVideos(){
    this.servicio_contenido.ObtenerVideosLista().subscribe(
      response => {
        this.dataSourceVideos = new MatTableDataSource(response.videos);
        this.dataSourceVideos.paginator = this.paginator_videos;
        this.dataSourceVideos.sort = this.sort_videos;
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceVideos.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceVideos.paginator) {
      this.dataSourceVideos.paginator.firstPage();
    }
  }

  confirmarEliminarVideo(nombre: string) {
    const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ELIMINAR EL VIDEO?');
    if (confirmacion) {
      this.servicio_contenido.EliminarVideo(nombre).subscribe(
        response => {
          this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
          this.LlenarTablaVideos();
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status)
        }
      );
    }
  }
}
