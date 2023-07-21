import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatosFavoritoInterface, FavoritosInterface, RespuestaGestionVideosInterface, RespuestaIsFavoriteOfInterface, RespuestaObtenerVideosInterface, RespuestaVideoInterface } from '../../modelos/contenido/gestion-videos.interface';
import { RespuestaSuscripcionActivaInterface, SuscripcionActivaInterface } from '../../modelos/contenido/suscripcion-activa.interface';

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

  ObternerVideo(id:any):Observable<RespuestaVideoInterface>{
    let dir = this.url + "GetVideoData";
    return this.http.post<RespuestaVideoInterface>(dir,id);
  }

  IsSubscriptionActive(id:SuscripcionActivaInterface):Observable<RespuestaSuscripcionActivaInterface>{
    let dir = this.url + "IsSubscriptionActive";
    return this.http.post<RespuestaSuscripcionActivaInterface>(dir, id);
  }

  ObtenerVideosListaFavoritos(ids:FavoritosInterface):Observable<RespuestaObtenerVideosInterface>{
    let dir = this.url + "ObtenerVideosListaFavoritos";
    return this.http.post<RespuestaObtenerVideosInterface>(dir, ids);
  }

  IsFavoriteOf(fav:DatosFavoritoInterface):Observable<RespuestaIsFavoriteOfInterface>{
    let dir = this.url + "IsFavoriteOf";
    return this.http.post<RespuestaIsFavoriteOfInterface>(dir,fav);
  }

  AgregarVideoFavoritos(fav:DatosFavoritoInterface):Observable<RespuestaGestionVideosInterface>{
    let dir = this.url + "AgregarVideoFavoritos";
    return this.http.post<RespuestaGestionVideosInterface>(dir, fav);
  }

  EliminarVideoFavoritos(fav:DatosFavoritoInterface):Observable<RespuestaGestionVideosInterface>{
    let dir = this.url + "EliminarVideoFavoritos";
    return this.http.post<RespuestaGestionVideosInterface>(dir, fav);
  }

  ObtenerVideosClasificacion(clasificacion:string):Observable<RespuestaObtenerVideosInterface>{
    let dir = this.url + "ObtenerVideosClasificacion/"+clasificacion;
    return this.http.get<RespuestaObtenerVideosInterface>(dir);
  }

}
