import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginInterface } from '../modelos/login.interface';
import { RespuestaLoginInterface } from '../modelos/respuesta-login.interface';
import { RecuperacionInterface } from '../modelos/recuperacion.interface';
import { RespuestaRecuperacionInterface } from '../modelos/respuesta-recuperacion.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioLoginService {
  private url_host: string | undefined;
  private url_port: string | undefined;
  private url: string | undefined;
  
  constructor(private http:HttpClient) { 
    this.url_host = environment.API_HOST;
    this.url_port = environment.API_PORT;
    this.url = `${this.url_host}${this.url_port}`+"/";
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
