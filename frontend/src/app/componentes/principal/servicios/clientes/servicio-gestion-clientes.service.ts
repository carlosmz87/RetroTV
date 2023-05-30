import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GestionClientesInterface, NuevaContrasenaInterface, NuevoCorreoInterface, NuevoTelefonoInterface, RespuestaDatosPerfilInterface, RespuestaDatosPerfilUsuarioInterface } from '../../modelos/clientes/gestion-clientes.interface';
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

  ObtenerPerfilAdministrador(id:Number):Observable<RespuestaDatosPerfilInterface>{
    let dir = this.url + `PerfilAdministrador/${id}`;
    return this.http.get<RespuestaDatosPerfilInterface>(dir);
  }

  ObtenerPerfilUsuario(id:Number):Observable<RespuestaDatosPerfilUsuarioInterface>{
    let dir = this.url + `PerfilUsuario/${id}`;
    return this.http.get<RespuestaDatosPerfilUsuarioInterface>(dir);
  }

  ActualizarCorreo(form:NuevoCorreoInterface):Observable<RespuestaClientesInterface>{
    let dir = this.url + `ActualizarCorreo`;
    return this.http.put<RespuestaClientesInterface>(dir, {...form.value});
  }

  ActualizarTelefono(form:NuevoTelefonoInterface):Observable<RespuestaClientesInterface>{
    let dir = this.url + `ActualizarTelefono`;
    return this.http.put<RespuestaClientesInterface>(dir, {...form.value});
  }

  ActualizarContrasena(form:NuevaContrasenaInterface):Observable<RespuestaClientesInterface>{
    let dir = this.url + `ActualizarContrasena`;
    return this.http.put<RespuestaClientesInterface>(dir, {...form.value});
  }

}
