import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private url_host: string | undefined;
  private url_port: string | undefined;
  private url: string | undefined;
  
  constructor(private http:HttpClient) { 
    this.url_host = environment.API_HOST;
    this.url_port = environment.API_PORT;
    this.url = `${this.url_host}${this.url_port}`+"/reporte/";
  }

  ObtenerReporte():Observable<any>{
    let dir = this.url + "generar";
    return this.http.get<HttpResponse<any>>(dir);
  }

  ObtenerSuscripciones():Observable<any>{
    let dir = this.url + "grafica";
    return this.http.get<HttpResponse<any>>(dir);
  }

  ObtenerDataCarousel():Observable<any>{
    let dir = this.url + "carousel";
    return this.http.get<HttpResponse<any>>(dir);
  }

}
