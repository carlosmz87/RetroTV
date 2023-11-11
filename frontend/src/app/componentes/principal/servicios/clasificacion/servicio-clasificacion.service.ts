import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClasificacionInterface } from '../../modelos/clasificacion/clasificacion.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ListaClasificacionesInterface, RespuestaClasificacionInterface, RespuestaListaClasificacionInterface } from '../../modelos/clasificacion/respuesta-clasificacion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioClasificacionService {
  private _clasificaciones$ = new BehaviorSubject<ListaClasificacionesInterface[]>([]);
  public clasificaciones$ = this._clasificaciones$.asObservable();
  private url_host: string | undefined;
  private url_port: string | undefined;
  private url: string | undefined;
  
  constructor(private http:HttpClient) { 
    this.url_host = environment.API_HOST;
    this.url_port = environment.API_PORT;
    this.url = `${this.url_host}${this.url_port}`+"/";
  }

  CrearClasificacion(form:ClasificacionInterface):Observable<RespuestaClasificacionInterface>{
    let dir = this.url + 'CrearClasificacion';
    return this.http.post<RespuestaClasificacionInterface>(dir, {...form.value});
  }

  EliminarClasificacion(form:ClasificacionInterface):Observable<RespuestaClasificacionInterface>{
    let dir = this.url + 'EliminarClasificacion';
    return this.http.request<RespuestaClasificacionInterface>('delete',dir, {body:form.value});
  }

  ListarClasificaciones():Observable<RespuestaListaClasificacionInterface>{
    let dir = this.url + 'ListarClasificaciones';
    return this.http.get<RespuestaListaClasificacionInterface>(dir).pipe(
      tap(
        response =>{
          this._clasificaciones$.next(response.clasificaciones);
        }
      )
    );
  }

  

}
