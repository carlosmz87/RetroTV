import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { ServicioGestionContenidoService } from '../servicios/contenido/servicio-gestion-contenido.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { VideosInterface } from '../modelos/contenido/gestion-videos.interface';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';

@Component({
  selector: 'app-vista-videos',
  templateUrl: './vista-videos.component.html',
  styleUrls: ['./vista-videos.component.css']
})
export class VistaVideosComponent implements OnInit {
  videos: VideosInterface[] = [];
  filterControl = new FormControl();
  dataSourceLoaded = false;
  pageSize = 4;
  pageSizeOptions = [4, 8, 12];
  pagedData: VideosInterface[] = [];
  id_user:Number = 0;
  is_logged:boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private servicio_contenido: ServicioGestionContenidoService,
    private servicio_generico: ServicioGenericosService,
    private authService: ServicioAuthService
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
    this.servicio_contenido.ObtenerVideosLista().subscribe(
      response => {
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
  }
}
