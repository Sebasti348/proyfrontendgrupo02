import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

interface Pelicula {
  id: number;
  titulo: string;
  poster: string;
}


interface Reserva {
  _id: string;
  usuario: string;
  funcion: any;
  cantidadReservas: number;
  fecha: string;
  butacasReservadas: string[];
  precioFinal: number;
  pagado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada';
}

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.component.html',
  styleUrls: ['./perfilusuario.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PerfilusuarioComponent implements OnInit {
  usuario: any;
  reservas: Reserva[] = [];
  estadisticas = {
    peliculasVistas: 0,
    reservasTotales: 0,
  };
  today = new Date();

  constructor(
    private loginService: LoginService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Get logged in user
    this.cargarUsuario();
    this.cargarReservas();
    
  }
  cargarUsuario(): void {

    this.usuarioService.getUsuario(this.loginService.idLogged() as string).subscribe(
      (result:any) => {
        this.usuario = result;

        
      },
      (error: any) => {

      }
    );
  }

  cargarReservas(): void {
    this.usuarioService.getReservasByUser(this.loginService.idLogged() as string).subscribe(
      (reservas:any) => {
        this.reservas = reservas;

        
        // Calculate statistics
        this.estadisticas.reservasTotales = this.reservas.length;
      },
      (error: any) => {

      }
    );
  }

  editarPerfil(): void {
    // TODO: Implement profile edit functionality

  }

  verDetalles(reserva: Reserva): void {
    // TODO: Navigate to reservation details page

  }

  cancelarReserva(reserva: Reserva): void {
    // TODO: Implement reservation cancellation

  }

  agregarCalendario(reserva: Reserva): void {
    // TODO: Implement calendar integration

  }

  dejarResena(reserva: Reserva): void {
    // TODO: Navigate to review page

  }
}
