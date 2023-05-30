import { FormControl, FormGroup } from "@angular/forms"

export interface ClientesInterface {
    id:Number,
    nombre:string,
    correo:string,
    usuario:string,
    genero:string,
    fecha_nacimiento:string,
    telefono:string,
    suscripcion:string
};

export interface GestionClientesInterface{
    status:string,
    RetroTV:string,
    usuarios:ClientesInterface[]
};

export interface RespuestaDatosPerfilInterface{
    status:string,
    RetroTV:string,
    datos:PerfilAdministrador
};

export interface RespuestaDatosPerfilUsuarioInterface{
    status:string,
    RetroTV:string,
    datos:PerfilUsuario
}

export interface PerfilAdministrador {
    nombre:string,
    usuario:string,
    correo:string,
    telefono:string
}

export interface PerfilUsuario{
    nombre:string,
    usuario:string,
    correo:string,
    telefono:string,
    suscripcion:string
}

export interface NuevoCorreoInterface extends FormGroup<{
    id:FormControl<Number>,
    correo:FormControl<string>
}>{};

export interface NuevoTelefonoInterface extends FormGroup<{
    id:FormControl<Number>,
    telefono:FormControl<string>
}>{};

export interface NuevaContrasenaInterface extends FormGroup<{
    id:FormControl<Number>,
    contrasena:FormControl<string>,
    conf_contrasena:FormControl<string>
}>{};

