import { Component, OnInit } from '@angular/core';
// import { Chart, ChartType, PieController, ArcElement } from 'chart.js';
import { Chart, ArcElement, PieController, ChartType, Legend, Title, Tooltip } from 'chart.js';
import { ReportesService } from '../servicios/reportes/reportes.service';

@Component({
  selector: 'app-vista-dashboard',
  templateUrl: './vista-dashboard.component.html',
  styleUrls: ['./vista-dashboard.component.css']
})

export class VistaDashboardComponent implements OnInit {

  public chart!: Chart;

  constructor(private reportesService: ReportesService) {
    // registrar controladores
    Chart.register(PieController);
    Chart.register(ArcElement);
    Chart.register(Legend);
    Chart.register(Title);
    Chart.register(Tooltip);
  }

  ngOnInit() {
    // data mock
    this.DibujarGrafica();
  }

  DibujarGrafica(): void {
    // Declaramos las variables que almacenaran los datos de la respuesta
    let activas: number;
    let inactivas: number;

    // Realizamos la peticion al servicio
    this.reportesService.ObtenerSuscripciones().subscribe(
      response => {
        // Obtenemos los datos de la respuesta
        for (const dato of response.suscripciones) {
          activas = dato.activas;
          inactivas = dato.inactivas;
        }
        // Configuramos la data y opciones de la grafica
        const data = {
          labels: ["Suscripciones activas","Suscripciones inactivas"],
          datasets: [
            {
              label: "Total",
              data: [activas, inactivas],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)'
              ],
            }
          ],
          
        }; 
        // Habilitamos la leyenda de la grafica
        const options = {
          plugins: {
            legend: {
              display: true
            }
          }
        }
        // Dibujamos la grafica en el canvas con id myChart
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'pie',
          data: data,
          options: options
        });
      })
  }
}