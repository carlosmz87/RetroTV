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
    portada_b64:string,
    esFavorito:boolean
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

export interface FavoritosInterface{
    id_usuario:Number
};

export interface DatosFavoritoInterface{
    id_usuario:Number,
    id_video:Number
};

export interface RespuestaIsFavoriteOfInterface{
    status:string,
    RetroTV:string,
    favorito:boolean
};

