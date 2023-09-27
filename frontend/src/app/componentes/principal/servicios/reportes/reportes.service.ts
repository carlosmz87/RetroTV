import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  url:string = "http://localhost:5000/reporte/";

  constructor(private http: HttpClient) { }

  ObtenerReporte():Observable<any>{
    let dir = this.url + "generar";
    return this.http.get<HttpResponse<any>>(dir);
  }

  ObtenerSuscripciones():Observable<any>{
    let dir = this.url + "grafica";
    return this.http.get<HttpResponse<any>>(dir);
  }

}
