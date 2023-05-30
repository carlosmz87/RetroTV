export interface RespuestaClasificacionInterface {
    status:string,
    RetroTV:string
}

export interface ListaClasificacionesInterface{
    nombre:string
}

export interface RespuestaListaClasificacionInterface{
    status:string,
    RetroTV:string,
    clasificaciones:ListaClasificacionesInterface[]
}

