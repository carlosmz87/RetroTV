export interface RespuestaClasificacionInterface {
    status:string,
    RetroTV:string
}

export interface ClasificacionesInterface{
    nombre:string
}

export interface RespuestaListaClasificacionInterface{
    status:string,
    RetroTV:string,
    clasificaciones:ClasificacionesInterface[]
}

