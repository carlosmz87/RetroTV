import { Component } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-vista-registro',
  templateUrl: './vista-registro.component.html',
  styleUrls: ['./vista-registro.component.css']
})
export class VistaRegistroComponent {
  FormularioRegistroCliente = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern('[A-Za-z]+')]),
    usuario: new FormControl('',[Validators.required, Validators.maxLength(10)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    contrasena: new FormControl('', [Validators.required]),
    conf_contrasena: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^(\\d{3}-\\d{3}-\\d{4})|(\\d{3}-\\d{4}-\\d{4})$')]),
    genero: new FormControl('', [Validators.required]),
    fecha: new FormControl('', [Validators.required]),
    suscripcion: new FormControl(false)
  });
  hide = true;
  
  formatPhone() {
    const phoneNumber = this.FormularioRegistroCliente.get('telefono')?.value;
    let formattedPhoneNumber = '';
  
    if (phoneNumber) {
      formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
      if (formattedPhoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
      } else if (formattedPhoneNumber.match(/^(\d{3})(\d{4})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
      }
    }
  
    this.FormularioRegistroCliente.get('telefono')?.setValue(formattedPhoneNumber);
  }
  
  RegistrarCliente(){
    console.log(this.FormularioRegistroCliente.value)
  }
}
