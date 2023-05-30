import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClasificacionInterface } from '../../modelos/clasificacion/clasificacion.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ClasificacionesInterface, RespuestaClasificacionInterface, RespuestaListaClasificacionInterface } from '../../modelos/clasificacion/respuesta-clasificacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioClasificacionService {
  private _clasificaciones$ = new BehaviorSubject<ClasificacionesInterface[]>([]);
  public clasificaciones$ = this._clasificaciones$.asObservable();
  constructor(private http:HttpClient) { 

  }
  url:string = 'http://localhost:5000/'

  CrearClasificacion(form:ClasificacionInterface):Observable<RespuestaClasificacionInterface>{
    let dir = this.url + 'CrearClasificacion';
    return this.http.post<RespuestaClasificacionInterface>(dir, {...form});
  }

  EliminarClasificacion(form:ClasificacionInterface):Observable<RespuestaClasificacionInterface>{
    let dir = this.url + 'EliminarClasificacion';
    return this.http.request<RespuestaClasificacionInterface>('delete',dir, {body:form});
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
