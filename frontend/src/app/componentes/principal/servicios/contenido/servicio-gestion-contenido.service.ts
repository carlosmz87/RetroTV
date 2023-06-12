import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaGestionVideosInterface, RespuestaObtenerVideosInterface } from '../../modelos/contenido/gestion-videos.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioGestionContenidoService {

  url:string = "http://localhost:5000/";

  constructor(private http: HttpClient) { }

  AgregarVideo(datos:FormData):Observable<RespuestaGestionVideosInterface>{
    let dir = this.url + "AgregarVideo";
    return this.http.post<RespuestaGestionVideosInterface>(dir,datos);
  }


  ObtenerVideosLista():Observable<RespuestaObtenerVideosInterface>{
    let dir = this.url + "ObtenerVideosLista";
    return this.http.get<RespuestaObtenerVideosInterface>(dir);
  }

  EliminarVideo(nombre:string):Observable<RespuestaGestionVideosInterface>{
    let dir = this.url + "EliminarVideo/"+nombre;
    return this.http.delete<RespuestaGestionVideosInterface>(dir);
  }

}
