import { Component } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { LoginInterface } from '../modelos/login.interface';

import { ServicioAuthService } from '../servicios/servicio-auth.service';
import { __values } from 'tslib';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-login',
  templateUrl: './vista-login.component.html',
  styleUrls: ['./vista-login.component.css']
})
export class VistaLoginComponent {
  hide = true;
  
  constructor(private fb: FormBuilder, private authService: ServicioAuthService, private servicio_genericos: ServicioGenericosService, private router:Router){
    this.formularioLogin = fb.nonNullable.group({
      username: fb.nonNullable.control('',[Validators.required]),
      contrasena: fb.nonNullable.control('',[Validators.required])
    });
  }

  formularioLogin!: LoginInterface;

  IniciarSesion(){
    if (this.formularioLogin.valid){
      this.authService.login(this.formularioLogin)
      .subscribe(
        response => {
          this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
          let userRole: string = "";
          this.authService.userRole$.subscribe(role => {
            userRole = role;
          });
          if(userRole  == "ADMINISTRADOR"){
            this.router.navigate(['/dashboard']);
          }else if (userRole == 'USUARIO'){
            this.router.navigate(['/'])
          }
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          this.formularioLogin.reset();
        }
      );    
    }
  }
}
