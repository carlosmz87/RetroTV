import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RecuperacionInterface } from '../modelos/recuperacion.interface';
import { ServicioLoginService } from '../servicios/servicio-login.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-recuperar',
  templateUrl: './vista-recuperar.component.html',
  styleUrls: ['./vista-recuperar.component.css']
})
export class VistaRecuperarComponent {
  formularioRecuperacion!:RecuperacionInterface;

  constructor(private fb: FormBuilder, private servicio:ServicioLoginService, private servicio_genericos: ServicioGenericosService, private router: Router){
    this.formularioRecuperacion = fb.nonNullable.group({
      correo: fb.nonNullable.control('',[Validators.required, Validators.email])
    });
  }

  RecuperarCuenta(){
    if(this.formularioRecuperacion.valid){
      this.servicio.RecuperarCredenciales(this.formularioRecuperacion)
      .subscribe(
        response =>{
          this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
          this.router.navigate(['/login']);
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          this.formularioRecuperacion.reset();
        } 
      );
    }
  }
}
