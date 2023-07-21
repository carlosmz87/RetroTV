import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { DatosFavoritoInterface, VideosInterface } from '../modelos/contenido/gestion-videos.interface';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vista-clasificaciones',
  templateUrl: './vista-clasificaciones.component.html',
  styleUrls: ['./vista-clasificaciones.component.css']
})
export class VistaClasificacionesComponent implements OnInit{
  videos: VideosInterface[] = [];
  filterControl = new FormControl();
  dataSourceLoaded = false;
  pageSize = 4;
  pageSizeOptions = [4, 8, 12];
  pagedData: VideosInterface[] = [];
  id_user:Number = 0;
  is_logged:boolean = false;
  data_fav!:DatosFavoritoInterface;
  clasificacion!:string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servicio_contenido: ServicioGestionContenidoService,
    private servicio_generico: ServicioGenericosService,
    private authService: ServicioAuthService,
    private route:ActivatedRoute
  ) {}

  ngOnInit() {
    this.LlenarGaleria();
    this.filterControl.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });

    this.authService.userId$.subscribe(
      value => {
        this.id_user = value;
      }
    )

    this.authService.isLogedIn$.subscribe(
      value => {
        this.is_logged = value;
      }
    )
  }

  applyFilter(filterValue: string) {
    if (!filterValue || filterValue === '') {
      this.pagedData = this.videos.slice(0, this.pageSize);
      return;
    }

    const filteredVideos = this.videos.filter(video => {
      const nombre = video.nombre.toLowerCase();
      return nombre.includes(filterValue.toLowerCase());
    });

    this.pagedData = filteredVideos.slice(0, this.pageSize);
    this.paginator.firstPage();
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedData = this.videos.slice(startIndex, endIndex);
  }

  LlenarGaleria() {
    this.route.params.subscribe(params =>{
      this.clasificacion = params['clasificacion'];
      this.servicio_contenido.ObtenerVideosClasificacion(this.clasificacion).subscribe(
        response => {        
          response.videos.forEach(vid => {
            this.data_fav = {
              id_usuario:this.id_user,
              id_video:vid.id
            }
            this.servicio_contenido.IsFavoriteOf(this.data_fav).subscribe(
              res => {
                vid.esFavorito = res.favorito;
              }
            );
          });
          this.videos = response.videos;
          this.dataSourceLoaded = true;
          this.pagedData = this.videos.slice(0, this.pageSize);
        },
        error => {
          this.servicio_generico.ConfigNotification(
            error.error.RetroTV,
            'OK',
            error.error.status
          );
        }
      );
    });
    
  }

  AgregarVideoFavoritos(id_vid:Number){
    this.data_fav = {
      id_usuario:this.id_user,
      id_video:id_vid
    }
    this.servicio_contenido.AgregarVideoFavoritos(this.data_fav).subscribe(
      response => {
        this.servicio_generico.ConfigNotification(response.RetroTV, 'OK', response.status);
        this.LlenarGaleria();
      },
      error => {
        this.servicio_generico.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
    
  }
    

}