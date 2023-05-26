export interface ClientesInterface {
    id:Number,
    nombre:string,
    correo:string,
    usuario:string,
    genero:string,
    fecha_nacimiento:string,
    telefono:string,
    suscripcion:string
}

export interface GestionClientesInterface{
    status:string,
    RetroTV:string,
    usuarios:ClientesInterface[]
}
