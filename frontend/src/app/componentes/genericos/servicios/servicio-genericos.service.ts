import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomNotificadorComponent } from '../notificador/custom-notificador.component';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioGenericosService {
  private recargarComponenteSource = new BehaviorSubject<boolean>(false);
  recargarComponente$ = this.recargarComponenteSource.asObservable();

  recargarComponente() {
    this.recargarComponenteSource.next(true);
  }
  
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
