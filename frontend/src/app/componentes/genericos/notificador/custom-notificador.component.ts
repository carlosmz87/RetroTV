import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-notificador',
  templateUrl: './custom-notificador.component.html',
  styleUrls: ['./custom-notificador.component.css']
})
export class CustomNotificadorComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data:any, public SnackBarRef:MatSnackBarRef<CustomNotificadorComponent>){}
  
  get cardClass(): string {
    // Genera la clase dinámica en función del tipo (error o success)
    return this.data.status === 'error' ? 'error-card' : 'success-card';
  }

}
