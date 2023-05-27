import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GestionClientesInterface } from '../../modelos/clientes/gestion-clientes.interface';
import { Observable } from 'rxjs';
import { SuscripcionesInterface } from '../../modelos/clientes/suscripciones.interface';
import { RespuestaClientesInterface } from '../../modelos/clientes/respuesta-clientes.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioGestionClientesService {
  
  url:string = "http://localhost:5000/";

  constructor(private http:HttpClient ) { }

  ListarClientes():Observable<GestionClientesInterface>{
    let dir = this.url + 'ListarClientes';
    return this.http.get<GestionClientesInterface>(dir);
  }

  ActivarSuscripcion(id:Number):Observable<SuscripcionesInterface>{
    let dir = this.url + `ActivarSuscripcion/${id}`;
    return this.http.post<SuscripcionesInterface>(dir, null);
  }

  CancelarSuscripcion(id:Number):Observable<SuscripcionesInterface>{
    let dir = this.url + `CancelarSuscripcion/${id}`;
    return this.http.post<SuscripcionesInterface>(dir, null);
  }

  EliminarCliente(id:Number):Observable<RespuestaClientesInterface>{
    let dir = this.url + `EliminarUsuario/${id}`;
    return this.http.delete<RespuestaClientesInterface>(dir);
  }

}
