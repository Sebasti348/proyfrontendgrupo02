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
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'utilizada';
}

@Component({
  selector: 'app-perfilusuario',
  templateUrl: './perfilusuario.component.html',
  styleUrls: ['./perfilusuario.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PerfilusuarioComponent implements OnInit {
  usuario: Usuario | null = null;
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
    this.usuario = new Usuario();
    // Load user reservations
    this.cargarReservas();
    this.cargarUsuario();
    
  }
  cargarUsuario(): void {
    this.usuarioService.getUsuario(this.loginService.idLogged() as string).subscribe(
      (usuario:any) => {
        this.usuario = usuario;
        console.log(this.usuario);
      },
      (error: any) => {
        console.log('Error al cargar usuario:', error);
      }
    );

    
    
  }

  cargarReservas(): void {
    if (this.loginService.idLogged() == null) {
      return;
    }
    let id = this.loginService.idLogged() as string;
    this.usuarioService.getReservasByUser(id).subscribe(
      (reservas:any) => {
        this.reservas = reservas;
        console.log('Reservas recibidas:', this.reservas);
        
        // Calculate statistics
        this.estadisticas.reservasTotales = this.reservas.length;
        
        // Calculate total tickets
        this.estadisticas.peliculasVistas = this.reservas.reduce((total, reserva) => total + (reserva.cantidadReservas || 0), 0);
      },
      (error: any) => {
        console.log('Error al cargar reservas:', error);
      }
    );
  }

  editarPerfil(): void {
    // TODO: Implement profile edit functionality
    console.log('Editar perfil');
  }

  verDetalles(reserva: Reserva): void {
    // TODO: Navigate to reservation details page
    console.log('Ver detalles de la reserva:', reserva);
  }

  cancelarReserva(reserva: Reserva): void {
    // TODO: Implement reservation cancellation
    console.log('Cancelar reserva:', reserva);
  }

  agregarCalendario(reserva: Reserva): void {
    // TODO: Implement calendar integration
    console.log('Agregar a calendario:', reserva);
  }

  dejarResena(reserva: Reserva): void {
    // TODO: Navigate to review page
    console.log('Dejar reseña:', reserva);
  }
}
