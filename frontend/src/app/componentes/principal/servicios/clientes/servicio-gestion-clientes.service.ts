import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GestionClientesInterface } from '../../modelos/clientes/gestion-clientes.interface';
import { Observable } from 'rxjs';

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
}
