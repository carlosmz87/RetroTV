import { Component, OnInit } from '@angular/core';
import { Chart, ChartType, PieController, ArcElement } from 'chart.js';
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
  }

  ngOnInit() {
    // data mock
    this.DibujarGrafica();

  }

  DibujarGrafica(): void {

    let activas: number;
    let inactivas: number;

    this.reportesService.ObtenerSuscripciones().subscribe(
      response => {
        for (const dato of response.suscripciones) {
          activas = dato.activas;
          inactivas = dato.inactivas;
        }

        // Datos para la grafica
        const data = {
          label: [
            "Activas",
            'Inactivas'
          ],
          datasets: [{
            data: [activas, inactivas],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)'
            ],
            hoverOffset: 4
          }]
        };

        // crear chart
        const ctx = document.getElementById('myChart') as HTMLCanvasElement;
        this.chart = new Chart(ctx, {
          type: 'pie' as ChartType,
          data: data,
          options: {
            elements: {
              arc: {
                borderWidth: 0
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  boxWidth: 20,
                  boxHeight: 20,
                  color: 'rgb(255, 255, 255)',
                }
              },
            },
          }
        });
      })
  }
}