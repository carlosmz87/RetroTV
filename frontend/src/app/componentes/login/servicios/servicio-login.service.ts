import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginInterface } from '../modelos/login.interface';
import { RespuestaLoginInterface } from '../modelos/respuesta-login.interface';
import { RecuperacionInterface } from '../modelos/recuperacion.interface';
import { RespuestaRecuperacionInterface } from '../modelos/respuesta-recuperacion.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicioLoginService {

  url:string = "http://localhost:5000/";
  
  constructor(private http:HttpClient) { 

  }

  LoginByForm(form:LoginInterface):Observable<RespuestaLoginInterface>{
    let dir = this.url + "login";
    return this.http.post <RespuestaLoginInterface>(dir, {...form.value});
  }

  RecuperarCredenciales(form: RecuperacionInterface):Observable<RespuestaRecuperacionInterface>{
    let dir = this.url + "recover";
    return this.http.post <RespuestaRecuperacionInterface>(dir, {...form.value});
  }

}
