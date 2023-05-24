import { FormGroup, FormControl } from "@angular/forms";

export interface RegistroInterface extends FormGroup<{
    nombre: FormControl<string>,
    usuario: FormControl<string>,
    correo: FormControl<string>,
    contrasena: FormControl<string>,
    conf_contrasena: FormControl<string>,
    telefono: FormControl<string>,
    genero: FormControl<string>,
    fecha: FormControl<string>,
    suscripcion: FormControl<boolean>
  }>{};
