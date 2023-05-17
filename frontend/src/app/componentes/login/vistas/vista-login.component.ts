import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-vista-login',
  templateUrl: './vista-login.component.html',
  styleUrls: ['./vista-login.component.css']
})
export class VistaLoginComponent {
  hide = true;
  formularioLogin = new FormGroup({
    usuario: new FormControl('', [Validators.required]),
    contrasena: new FormControl('', [Validators.required]) 
  });

  IniciarSesion(){
    console.log(this.formularioLogin.value);
  }
}
