import { Component } from '@angular/core';
import { ReportesService } from '../servicios/reportes/reportes.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-vista-reportes',
  templateUrl: './vista-reportes.component.html',
  styleUrls: ['./vista-reportes.component.css']
})
export class VistaReportesComponent {

  constructor(private reportesService: ReportesService) { }

  generateAndDownloadReport(): void {
    console.log("Generando reporte...");
    this.reportesService.ObtenerReporte().subscribe(
      response => {
        console.log(response.lista_clasificacion)
        const dataObj: { [key: string]: any[] } = {
          'Clasificacion videos': response.videos_existente,
          'Lista clasificacion': response.lista_clasificacion,
          'Lista canales': response.lista_canales,
          'Lista usuarios': response.lista_usuarios,
          'Lista suscripciones': response.lista_suscripciones,
        };

        // Crear un libro de trabajo (Workbook) de XLSX
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        // Iterar a través de las hojas de datos en el objeto
        for (const sheetName in dataObj) {
          if (dataObj.hasOwnProperty(sheetName)) {
            const jsonData = dataObj[sheetName];
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
        }

        // Generar el archivo XLSX en formato de array
        const xlsxData: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Convertir el array en un Blob
        const blob: Blob = new Blob([xlsxData], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Crear una URL para el blob
        const blobURL: string = URL.createObjectURL(blob);

        // Crear un elemento <a> para descargar el archivo
        const a: HTMLAnchorElement = document.createElement('a');
        a.href = blobURL;
        a.download = 'Reporte_retroTV.xlsx'; // Nombre del archivo XLSX

        // Simular un clic en el elemento <button> para iniciar la descarga
        a.click();

        // Liberar la URL
        URL.revokeObjectURL(blobURL);
      }, error => {
        console.log(error);
      }
    );
  }
}
