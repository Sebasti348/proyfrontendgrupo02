import { Pelicula } from "./pelicula";

export class Funcion {
    _id?: string;
    hora: string;
    sala: string;
    fecha: Date;
    numeroButacas: number;
    butacasOcupadas: string[];
    precio: number;
    pelicula: Pelicula;
    //Agregué este campo
    estado: string;

    constructor() {
        this.hora = '';
        this.sala = '';
        this.fecha = new Date();
        this.numeroButacas = 50;
        this.butacasOcupadas = [];
        this.precio = 1;
        this.pelicula = new Pelicula();
        this.estado = '';
    }
}