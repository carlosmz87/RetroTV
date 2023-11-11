import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroInterface } from '../modelos/registro.interface';
import { RespuestaRegistroInterface } from '../modelos/respuesta-registro.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioRegistroService {
  
  private url_host: string | undefined;
  private url_port: string | undefined;
  private url: string | undefined;
  
  constructor(private http:HttpClient) { 
    this.url_host = environment.API_HOST;
    this.url_port = environment.API_PORT;
    this.url = `${this.url_host}${this.url_port}`+"/";
  }

  RegisterByForm(form:RegistroInterface):Observable<RespuestaRegistroInterface>{
    let dir = this.url + "RegistrarUsuario";
    return this.http.post<RespuestaRegistroInterface>(dir, {...form.value});
  }
}
