// reservas.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion';
import { Reserva } from '../../models/reserva';
import { ReservasService } from '../../services/reserva.service';
import { LoginService } from '../../services/login.service';
import { Location } from '@angular/common';
interface ButacaUI {
  id: string;
  status: 'available' | 'selected' | 'occupied';
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  funcionId: string | null = null;
  funcionSeleccionada: Funcion = new Funcion();

  rows: string[] = ['A', 'B', 'C', 'D', 'E'];
  cols: number = 10;
  butacas: ButacaUI[] = [];
  butacaSeleccionada: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private funcionService: FuncionesService,
    private reservaService: ReservasService,
    private router: Router,
    private loginservice: LoginService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.funcionId = params.get('id');
      if (this.funcionId) {
        console.log('ID de la función recibido:', this.funcionId);
        this.obtenerFuncion();
      } else {
        console.error('No se recibió ID de función en la ruta.');
        alert('Error: No se recibió el ID de la función. Por favor, intente de nuevo.');
        this.router.navigate(['/']); // Redirigir o manejar el error
      }
    });
  }

  obtenerFuncion(): void {
    if (!this.funcionId) return;

    this.funcionService.getFuncion(this.funcionId).subscribe(
      result => {
        this.funcionSeleccionada = result;
        console.log('Función seleccionada cargada:', this.funcionSeleccionada);
        // Asegúrate de que butacasOcupadas sea un array, incluso si es null/undefined
        this.generateSeats(this.funcionSeleccionada.butacasOcupadas || []);
      },
      error => {
        console.error('Error al obtener la función:', error);
        alert('No se pudo cargar la información de la función. Inténtalo de nuevo.');
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  generateSeats(occupiedSeatsIds: string[]): void {
    this.butacas = [];
    this.butacaSeleccionada.clear();

    this.rows.forEach(rowLetter => {
      for (let i = 1; i <= this.cols; i++) {
        const seatId = `${rowLetter}${i}`;
        const status = occupiedSeatsIds.includes(seatId) ? 'occupied' : 'available';
        this.butacas.push({ id: seatId, status: status });
      }
    });
  }

  handleSeatClick(seat: ButacaUI): void {
    if (seat.status === 'available') {
      seat.status = 'selected';
      this.butacaSeleccionada.add(seat.id);
    } else if (seat.status === 'selected') {
      seat.status = 'available';
      this.butacaSeleccionada.delete(seat.id);
    }
    console.log('Butacas seleccionadas actualmente:', Array.from(this.butacaSeleccionada));
  }

  reservarButacas(): void {
    if (this.butacaSeleccionada.size === 0) {
      alert('Por favor, selecciona al menos una butaca para reservar.');
      return;
    }

    if (!this.funcionId || !this.funcionSeleccionada || !this.funcionSeleccionada._id) {
      alert('Error: No se ha cargado la información completa de la función.');
      return;
    }

    const seatsToReserveArray = Array.from(this.butacaSeleccionada);
    const idUsuario = this.loginservice.idLogged();
    const nuevaReserva = new Reserva();
    if (idUsuario != null) {
      nuevaReserva.usuario = idUsuario; // <-- ¡IMPORTANTE! Reemplaza con el ID de usuario real (ej: desde un servicio de autenticación)
    }
    nuevaReserva.funcion = this.funcionSeleccionada; // Envía solo el ID de la función
    nuevaReserva.cantidadReservas = seatsToReserveArray.length;

    // Asigna la fecha y hora actuales al momento de la reserva
    nuevaReserva.fecha = new Date();

    nuevaReserva.precioFinal = seatsToReserveArray.length * this.funcionSeleccionada.precio;
    nuevaReserva.butacasReservadas = seatsToReserveArray;
    nuevaReserva.qr = 'QR_GENERADO_EN_BACKEND_O_PLACEHOLDER'; // El QR probablemente lo genera el backend

    console.log('Objeto Reserva a enviar:', nuevaReserva);

    this.reservaService.createReserva(nuevaReserva).subscribe(
      response => {
        alert('¡Reserva realizada con éxito!');
        console.log('Respuesta de la reserva:', response);

        // Recargar la función para actualizar el estado de las butacas en la UI
        this.obtenerFuncion();
        this.butacaSeleccionada.clear(); // Limpia las selecciones en el front después de una reserva exitosa
        this.router.navigate(['']);
      },
      error => {
        console.error('Error al realizar la reserva:', error);
        let errorMessage = 'No se pudo completar la reserva. Inténtalo de nuevo.';
        if (error.error && error.error.msg) {
          errorMessage = error.error.msg;
        } else if (error.message) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      }
    );
  }

  pagarReserva() {
    // Lógica para procesar el pago de la reserva
  }
}