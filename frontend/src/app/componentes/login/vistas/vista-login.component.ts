import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { LoginInterface } from '../modelos/login.interface';
import { ServicioLoginService } from '../servicios/servicio-login.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-vista-login',
  templateUrl: './vista-login.component.html',
  styleUrls: ['./vista-login.component.css']
})
export class VistaLoginComponent {
  hide = true;
  
  constructor(private fb: FormBuilder, private servicio_genericos: ServicioGenericosService, private servicio: ServicioLoginService, private cookieService: CookieService){
    this.formularioLogin = fb.nonNullable.group({
      username: fb.nonNullable.control('',[Validators.required]),
      contrasena: fb.nonNullable.control('',[Validators.required])
    });
  }

  formularioLogin!: LoginInterface;

  IniciarSesion(){
    if (this.formularioLogin.valid){
      this.servicio.LoginByForm(this.formularioLogin)
      .subscribe(
        response => {
          this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
          this.cookieService.set('token', response.auth_token);
          console.log(response)
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
        }
      );      
    }
  }
}
