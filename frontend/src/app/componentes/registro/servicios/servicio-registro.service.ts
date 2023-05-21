import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroInterface } from '../modelos/registro.interface';
import { RespuestaRegistroInterface } from '../modelos/respuesta-registro.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioRegistroService {
  
  url:string = "http://localhost:5000/";

  constructor(private http:HttpClient) {

  }

  RegisterByForm(form:RegistroInterface):Observable<RespuestaRegistroInterface>{
    let dir = this.url + "RegistrarUsuario";
    return this.http.post<RespuestaRegistroInterface>(dir, {...form.value});
  }
}
