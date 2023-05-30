import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder} from '@angular/forms';
import { NuevaContrasenaInterface, NuevoTelefonoInterface, RespuestaDatosPerfilInterface } from '../modelos/clientes/gestion-clientes.interface';
import { ClasificacionInterface } from '../modelos/clasificacion/clasificacion.interface';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { ServicioGenericosService } from '../../genericos/servicios/servicio-genericos.service';
import { ServicioClasificacionService } from '../servicios/clasificacion/servicio-clasificacion.service';
import { ServicioGestionClientesService } from '../servicios/clientes/servicio-gestion-clientes.service';
import { RespuestaListaClasificacionInterface } from '../modelos/clasificacion/respuesta-clasificacion.interface';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-perfil-administrador',
  templateUrl: './vista-perfil-administrador.component.html',
  styleUrls: ['./vista-perfil-administrador.component.css']
})
export class VistaPerfilAdministradorComponent {
  constructor(private router:Router, private cookieSrvice:CookieService, private fb:FormBuilder, private authService:ServicioAuthService, private servicio_genericos:ServicioGenericosService, private servicio_clasificacion:ServicioClasificacionService, private servicio_gestion:ServicioGestionClientesService){
    
  }
  
  ngOnInit(){
    this.authService.userId$.subscribe(
      id => {
        this.id_user = id;
      }
    );
    

    this.formularioTelefono = this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(this.id_user),
      telefono: this.fb.nonNullable.control('', [Validators.required,Validators.pattern('^(\\d{3}-\\d{3}-\\d{4})|(\\d{3}-\\d{4}-\\d{4})$')])
    });

    this.formularioContrasena = this.fb.nonNullable.group({
      id: this.fb.nonNullable.control(this.id_user),
      contrasena: this.fb.nonNullable.control('', [Validators.required]),
      conf_contrasena: this.fb.nonNullable.control('', [Validators.required])
    });

    this.formularioAgregarClasificacion = this.fb.nonNullable.group({
      nombre:this.fb.nonNullable.control('',[Validators.required])
    });

    this.formularioEliminarClasificacion = this.fb.nonNullable.group({
      nombre:this.fb.nonNullable.control('',[Validators.required])
    });

    this.LlenarDatosPersonales(this.id_user);
    this.LlenarClasificaciones();
  }

  id_user:Number = 0;
  
  formularioTelefono!:NuevoTelefonoInterface;
  formularioContrasena!:NuevaContrasenaInterface;
  formularioAgregarClasificacion!:ClasificacionInterface;
  formularioEliminarClasificacion!:ClasificacionInterface;
  datos_perfil:RespuestaDatosPerfilInterface = {
    status: '',
    RetroTV: '',
    datos: {
      nombre:'',
      usuario:'',
      correo:'',
      telefono:''
    }
  };

  clasificaciones:RespuestaListaClasificacionInterface = {
    status:'',
    RetroTV:'',
    clasificaciones:[]
  }

  hide = true;
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
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS ACTALIZAR TU NUMERO DE TELEFONO?');
      if(confirmacion){
        this.servicio_gestion.ActualizarTelefono(this.formularioTelefono).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.LlenarDatosPersonales(this.id_user);
            this.resetFormularios();
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
            this.cookieSrvice.delete('token');
            this.router.navigate(['/login']);
            this.servicio_genericos.recargarComponente();
          },
          error => {
            console.log(error);
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
      }     
    }
  }

  AgregarClasificacion(){
    if(this.formularioAgregarClasificacion.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS AGREGAR UNA NUEVA CLASIFICACION AL SISTEMA?');
      if(confirmacion){
        this.servicio_clasificacion.CrearClasificacion(this.formularioAgregarClasificacion).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.LlenarClasificaciones();
            this.resetFormularios();
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
      } 
    }
  }
  EliminarClasificacion(){
    if(this.formularioEliminarClasificacion.valid){
      const confirmacion = confirm('¿ESTAS SEGURO QUE DESEAS AGREGAR UNA NUEVA CLASIFICACION AL SISTEMA?');
      if(confirmacion){
        this.servicio_clasificacion.EliminarClasificacion(this.formularioEliminarClasificacion).subscribe(
          response => {
            this.servicio_genericos.ConfigNotification(response.RetroTV, 'OK', response.status);
            this.LlenarClasificaciones();
            this.resetFormularios();
          },
          error => {
            this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
          }
        )
      }       
    }
  }

  LlenarDatosPersonales(id:Number){
    this.servicio_gestion.ObtenerPerfilAdministrador(id).subscribe(
      response => {
        this.datos_perfil.status = response.status;
        this.datos_perfil.RetroTV = response.RetroTV;
        this.datos_perfil.datos = response.datos;
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }

  LlenarClasificaciones(){
    this.servicio_clasificacion.ListarClasificaciones().subscribe(
      response => {
        this.clasificaciones.status = response.status,
        this.clasificaciones.RetroTV = response.RetroTV,
        this.clasificaciones.clasificaciones = response.clasificaciones
      },
      error => {
        this.servicio_genericos.ConfigNotification(error.error.RetroTV, 'OK', error.error.status);
      }
    );
  }

  resetFormularios() {

    this.formularioTelefono.reset();

    this.formularioContrasena.reset();

    this.formularioAgregarClasificacion.reset();

    this.formularioEliminarClasificacion.reset();
  }

}
