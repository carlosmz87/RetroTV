import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NuevoCorreoInterface, NuevoTelefonoInterface, NuevaContrasenaInterface, RespuestaDatosPerfilUsuarioInterface } from '../modelos/clientes/gestion-clientes.interface';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { ServicioGestionClientesService } from '../servicios/clientes/servicio-gestion-clientes.service';

@Component({
  selector: 'app-vista-perfil-usuario',
  templateUrl: './vista-perfil-usuario.component.html',
  styleUrls: ['./vista-perfil-usuario.component.css']
})
export class VistaPerfilUsuarioComponent {
  constructor(private fb:FormBuilder, private authService:ServicioAuthService, private servicio_genericos:ServicioGenericosService, private servicio_gestion:ServicioGestionClientesService){
  }
  ngOnInit(){
    this.authService.userId$.subscribe(
      id => {
        this.id_user = id;
      }
    );
    this.formularioCorreo = this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(this.id_user),
      correo: this.fb.nonNullable.control('', [Validators.required, Validators.email])
    });

    this.formularioTelefono = this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(this.id_user),
      telefono: this.fb.nonNullable.control('', [Validators.required,Validators.pattern('^(\\d{3}-\\d{3}-\\d{4})|(\\d{3}-\\d{4}-\\d{4})$')])
    });

    this.formularioContrasena = this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(this.id_user),
      contrasena: this.fb.nonNullable.control('', [Validators.required]),
      conf_contrasena: this.fb.nonNullable.control('', [Validators.required])
    });

    this.LlenarDatosPersonales(this.id_user);

  }
  hide = true;
  formularioCorreo!:NuevoCorreoInterface
  formularioTelefono!:NuevoTelefonoInterface
  formularioContrasena!:NuevaContrasenaInterface
  datos_perfil:RespuestaDatosPerfilUsuarioInterface = {
    status: '',
    RetroTV: '',
    datos: {
      nombre:'',
      usuario:'',
      correo:'',
      telefono:'',
      suscripcion:''
    }
  };
  id_user:Number=0;
  formatPhone() {
    const phoneNumber = this.formularioTelefono.get('telefono')?.value;
    let formattedPhoneNumber = '';
  
    if (phoneNumber) {
      formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
      if (formattedPhoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
      } else if (formattedPhoneNumber.match(/^(\d{3})(\d{4})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
      }
    }
  
    this.formularioTelefono.get('telefono')?.setValue(formattedPhoneNumber);
  }

  ActualizarTelefono(){
    if(this.formularioTelefono.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU CORREO ELECTRONICO?');
      if(confirmacion){
        /*this.servicio_gestion.ActualizarTelefono(this.formularioTelefono).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.formularioTelefono.reset();
            this.LlenarDatosPersonales(this.id_user);
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )*/
      }
    }
  }

  ActualizarCorreo(){
    if(this.formularioCorreo.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU CORREO ELECTRONICO?');
      if(confirmacion){
        /*this.servicio_gestion.ActualizarCorreo(this.formularioCorreo).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.formularioCorreo.reset();
            this.LlenarDatosPersonales(this.id_user);
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )*/
      }
    }
  }

  ActualizarContrasena(){
    if(this.formularioContrasena.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU CONTRASEÑA?');
      if(confirmacion){
        /*this.servicio_gestion.ActualizarContrasena(this.formularioContrasena).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.formularioContrasena.reset();
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )*/
      }     
    }
  }


  LlenarDatosPersonales(id:Number){
    this.servicio_gestion.ObtenerPerfilUsuario(id).subscribe(
      response => {
        this.datos_perfil.status = response.status,
        this.datos_perfil.RetroTV = response.RetroTV,
        this.datos_perfil.datos = response.datos
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }

}
