import { Component } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { ServicioRegistroService } from '../servicios/servicio-registro.service';
import { RegistroInterface } from '../modelos/registro.interface';

@Component({
  selector: 'app-vista-registro',
  templateUrl: './vista-registro.component.html',
  styleUrls: ['./vista-registro.component.css']
})
export class VistaRegistroComponent {

  constructor(private servicio:ServicioRegistroService, private fb: FormBuilder){
    this.FormularioRegistroCliente = fb.nonNullable.group({
      nombre: fb.nonNullable.control('', [Validators.required, Validators.pattern('[A-Za-z ñÑ]+')]),
      usuario: fb.nonNullable.control('', [Validators.required, Validators.maxLength(10)]),
      correo: fb.nonNullable.control('', [Validators.required, Validators.email]),
      contrasena: fb.nonNullable.control('', [Validators.required]),
      conf_contrasena: fb.nonNullable.control('', [Validators.required]),
      telefono: fb.nonNullable.control('', [Validators.required,Validators.pattern('^(\\d{3}-\\d{3}-\\d{4})|(\\d{3}-\\d{4}-\\d{4})$')]),
      genero: fb.nonNullable.control('', [Validators.required]),
      fecha: fb.nonNullable.control('', [Validators.required]),
      suscripcion: fb.nonNullable.control(false, [Validators.required])})
  }

  FormularioRegistroCliente!: RegistroInterface;

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
    if (this.FormularioRegistroCliente.valid) {
      this.servicio.RegisterByForm(this.FormularioRegistroCliente)
        .subscribe(
          response => {
            // Manejar la respuesta del backend en caso de éxito
            console.log(response);
          },
          error => {
            // Manejar el error en caso de fallo
            console.error(error);
          }
        );
    }
  }
}
