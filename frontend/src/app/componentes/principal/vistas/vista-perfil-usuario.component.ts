import { Component } from '@angular/core';

@Component({
  selector: 'app-vista-perfil-usuario',
  templateUrl: './vista-perfil-usuario.component.html',
  styleUrls: ['./vista-perfil-usuario.component.css']
})
export class VistaPerfilUsuarioComponent {
  constructor(){}
  hide = true;
  formatPhone() {
    /*const phoneNumber = this.FormularioRegistroCliente.get('telefono')?.value;
    let formattedPhoneNumber = '';
  
    if (phoneNumber) {
      formattedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Elimina todos los caracteres no numéricos
      if (formattedPhoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
      } else if (formattedPhoneNumber.match(/^(\d{3})(\d{4})(\d{4})$/)) {
        formattedPhoneNumber = formattedPhoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
      }
    }
  
    this.FormularioRegistroCliente.get('telefono')?.setValue(formattedPhoneNumber);*/
  }
}
