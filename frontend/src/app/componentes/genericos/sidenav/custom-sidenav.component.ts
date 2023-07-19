import { Component, OnInit } from '@angular/core';
import { ServicioClasificacionService } from '../../principal/servicios/clasificacion/servicio-clasificacion.service';
import { Validators, FormBuilder} from '@angular/forms';
import { ClasificacionInterface } from '../../principal/modelos/clasificacion/clasificacion.interface';
import { RespuestaListaClasificacionInterface } from '../../principal/modelos/clasificacion/respuesta-clasificacion.interface';
import { Router } from '@angular/router';
import { ServicioGenericosService } from '../servicios/servicio-genericos.service';
@Component({
  selector: 'app-custom-sidenav',
  templateUrl: './custom-sidenav.component.html',
  styleUrls: ['./custom-sidenav.component.css']
})
export class CustomSidenavComponent implements OnInit{
  formularioListarClasificacion!:ClasificacionInterface;
  clasificaciones:RespuestaListaClasificacionInterface = {
    status:'',
    RetroTV:'',
    clasificaciones:[]
  }
  constructor(private router:Router, private fb:FormBuilder, private servicio_clasificacion:ServicioClasificacionService, private servicio_genericos:ServicioGenericosService){}


  ngOnInit(){
    this.formularioListarClasificacion = this.fb.nonNullable.group({
      nombre:this.fb.nonNullable.control('',[Validators.required])
    });
    this.LlenarClasificaciones();
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

  IrClasificacion(){
    if(this.formularioListarClasificacion.valid){
      this.router.navigate(['/clasificaciones/'+this.formularioListarClasificacion.value.nombre]);
      this.formularioListarClasificacion.reset();
    }
  }
}
