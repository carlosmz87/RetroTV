import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-vista-recuperar',
  templateUrl: './vista-recuperar.component.html',
  styleUrls: ['./vista-recuperar.component.css']
})
export class VistaRecuperarComponent {
  formularioRecuperacion = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email])
  });

  RecuperarCuenta(){
    console.log(this.formularioRecuperacion.value)
  }
}
