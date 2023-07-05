import { AbstractControl, FormControl, FormGroup } from "@angular/forms";

export interface GestionVideosInterface{

};

export interface RespuestaGestionVideosInterface{
    status:string,
    RetroTV:string,
};

export interface RespuestaObtenerVideosInterface{
    status:string,
    RetroTV:string,
    videos: VideosInterface[]
};


export interface VideosInterface{
    id:Number,
    nombre:string,
    fecha:string,
    resena:string,
    duracion:string,
    clasificacion:string,
    portada:string,
    portada_b64:string
};

export interface VideoInterface{
    nombre:string,
    fecha:string,
    resena:string,
    duracion:string,
    clasificacion:string,
    portada:string,
    video_url:string
};

export interface RespuestaVideoInterface{
    status:string,
    RetroTV:string,
    data:VideoInterface
}