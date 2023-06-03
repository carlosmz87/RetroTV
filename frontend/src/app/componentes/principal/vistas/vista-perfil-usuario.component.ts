import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NuevoCorreoInterface, NuevoTelefonoInterface, NuevaContrasenaInterface, RespuestaDatosPerfilUsuarioInterface } from '../modelos/clientes/gestion-clientes.interface';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { ServicioGestionClientesService } from '../servicios/clientes/servicio-gestion-clientes.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SolicitarSuscripcionInterface } from '../modelos/clientes/suscripciones.interface';

@Component({
  selector: 'app-vista-perfil-usuario',
  templateUrl: './vista-perfil-usuario.component.html',
  styleUrls: ['./vista-perfil-usuario.component.css']
})
export class VistaPerfilUsuarioComponent {
  constructor(private router:Router,private cookieService:CookieService,private fb:FormBuilder, private authService:ServicioAuthService, private servicio_genericos:ServicioGenericosService, private servicio_gestion:ServicioGestionClientesService){
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
    this.usuario ={
      "usuario":this.datos_perfil.datos.usuario
    }
  }
  hide = true;
  usuario!:SolicitarSuscripcionInterface;
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
        console.log(this.formularioTelefono);
        this.servicio_gestion.ActualizarTelefono(this.formularioTelefono).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.resetFormularios();
            this.LlenarDatosPersonales(this.id_user);
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
      }
    }
  }

  ActualizarCorreo(){
    if(this.formularioCorreo.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU CORREO ELECTRONICO?');
      if(confirmacion){
        console.log(this.formularioCorreo);
        this.servicio_gestion.ActualizarCorreo(this.formularioCorreo).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.resetFormularios();
            this.LlenarDatosPersonales(this.id_user);
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
      }
    }
  }

  ActualizarContrasena(){
    if(this.formularioContrasena.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU CONTRASEÑA?');
      if(confirmacion){
        console.log(this.formularioContrasena);
        this.servicio_gestion.ActualizarContrasena(this.formularioContrasena).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.resetFormularios();
            this.cookieService.delete('token');
            this.router.navigate(['/login']);
            this.servicio_genericos.recargarComponente();
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
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

  resetFormularios() {
    this.formularioCorreo.reset();

    this.formularioTelefono.reset();

    this.formularioContrasena.reset();
  }

  CancelarSuscripcion(){
    const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS CANCELAR TU SUSCRIPCION?');
      if(confirmacion){
        this.servicio_gestion.CancelarSuscripcion(this.id_user).subscribe(
          response => {
            if(response.respuesta.includes("EXITOSAMENTE")){
              this.servicio_genericos.ConfigNotification(response.respuesta, 'OK', response.status);
              this.cookieService.delete('token');
              this.router.navigate(['/login']);
              this.servicio_genericos.recargarComponente();
            }else if(response.respuesta.includes("ERROR")){
              this.servicio_genericos.ConfigNotification(response.respuesta, 'OK', 'error');
            }     
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.respuesta, 'OK', error.error.status);
          }
        );
      }
  }
  
  EliminarCuenta(){
    const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ELIMINAR TU CUENTA?');
    if(confirmacion){
      this.servicio_gestion.EliminarCliente(this.id_user).subscribe(
        response => {
          if(response.RetroTV.includes("EXITOSAMENTE")){
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.cookieService.delete('token');
            this.router.navigate(['/login']);
            this.servicio_genericos.recargarComponente();
          }else if(response.RetroTV.includes("ERROR")){
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', 'error');
          }     
        },
        error => {
          this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
        }
      );
    }
  }



  SolicitarSuscripcion(usuario:SolicitarSuscripcionInterface){
    this.servicio_gestion.SolicitarSuscripcion(usuario).subscribe(
      response => {
        this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    )
  }
}
