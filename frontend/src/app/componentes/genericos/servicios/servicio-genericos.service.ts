import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomNotificadorComponent } from '../notificador/custom-notificador.component';

@Injectable({
  providedIn: 'root'
})
export class ServicioGenericosService {

  constructor(private snackbar:MatSnackBar) { }

  ConfigNotification(mensaje:string, botonlbl:string, tipo:string){
    this.snackbar.openFromComponent(CustomNotificadorComponent,{
      data:{
        status:tipo,
        message: mensaje,
        action: botonlbl
      },
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: tipo === 'error' ? 'error-card' : 'success-card'
    })
  }


}
