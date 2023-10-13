import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../servicios/reportes/reportes.service';

@Component({
  selector: 'app-vista-inicio',
  templateUrl: './vista-inicio.component.html',
  styleUrls: ['./vista-inicio.component.css']
})
export class VistaInicioComponent implements OnInit{

  ngOnInit(): void {
    setInterval(() => {
      this.changeSlide();
    }
    , 2000);
    this.ObtenerDataCarousel();
  }

  slides: any[] = [];
  currentSlide = 0;
  
  constructor(private reportesService: ReportesService) { }

  ObtenerDataCarousel(){
    this.reportesService.ObtenerDataCarousel().subscribe(
      response => {
        //console.log(response.videos);
        response.videos.forEach((element: any) => {
          //console.log(element.nombre);
          // Extraer el nombre del archivo sin la extensión
          const nombre = element.nombre.split('.')[0].replace(/_/g, ' '); // Quitar extension despues del punto y reemplazar los guiones bajos por espacios
          this.slides.push({imagen:"data:image/jpeg;base64,"+element.portada, titulo:nombre, descripcion:element.resena});
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  onPreviousClick() {
    const previous = this.currentSlide - 1;
    this.currentSlide = previous < 0 ? this.slides.length - 1 : previous;
  }
  
  onNextClick() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }

  changeSlide() {
    const next = this.currentSlide + 1;
    this.currentSlide = next === this.slides.length ? 0 : next;
  }

}
