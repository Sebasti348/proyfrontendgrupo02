import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reserva.service';
import { FuncionesService } from '../../services/funciones.service';
import { PeliculasService } from '../../services/peliculas.service';
interface Reserva {
    _id?: string;
    usuario: string;
    funcion: Funcion;
    originalTitle: string;
    cantidadReservas: number;
    fecha: Date;
    precioFinal: number;
    butacasReservadas: string[];
    qr: string;
}
interface Pelicula {
  _id?: string;
  originalTitle: string;
  description: string;
  releaseDate: Date;
  trailer: string;
  primaryImage: string;
}
interface Funcion {
    _id?: string;
    hora: string;
    sala: string;
    fecha: Date;
    numeroButacas: number;
    butacasOcupadas: string[];
    precio: number;
    pelicula: Pelicula;
    estado: string;
}


@Component({
  selector: 'app-lista-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-reservas.component.html',
  styleUrl: './lista-reservas.component.css'
})
export class ListaReservasComponent {
  reservas: Reserva[] = [];
  Peliculas: Pelicula[] = [];
  funciones: Funcion[] = [];
  constructor(private reservasService: ReservasService,private funcionService: FuncionesService,private PeliculasService: PeliculasService) {}

  ngOnInit(): void {
    this.CargarReservas();
    
    
  }

  CargarReservas(){
    this.reservasService.getReservas().subscribe((data:any) => {

      this.reservas = data;
    });
    this.funcionService.getFunciones().subscribe((data:any) => {

      this.funciones = data;
    });
    this.PeliculasService.getPeliculas().subscribe((data:any) => {

      this.Peliculas = data;
    });
    
  }
}
