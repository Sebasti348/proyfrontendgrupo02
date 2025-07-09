import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion';
import { Reserva } from '../../models/reserva';
import { Usuario } from '../../models/usuario';
import { ReservasService } from '../../services/reserva.service';
import { LoginService } from '../../services/login.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';

interface ButacaUI {
  id: string; // Identificador único de la butaca (ej. "A1", "B5")
  status: 'available' | 'selected' | 'occupied'; // Estado de la butaca: disponible, seleccionada o ocupada
}

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})

export class ReservasComponent implements OnInit {
  
  funcionId: string | null = null; // Almacena el ID de la función recibido de la ruta
  funcionSeleccionada: Funcion = new Funcion(); // Objeto para almacenar los detalles de la función seleccionada

  rows: string[] = ['A', 'B', 'C', 'D', 'E']; // Filas de butacas (letras)
  cols: number = 10; // Número de columnas de butacas por fila
  butacas: ButacaUI[] = []; // Array que representa el estado de todas las butacas en la UI
  butacaSeleccionada: Set<string> = new Set(); // Conjunto para almacenar los IDs de las butacas seleccionadas por el usuario
  reservaPendiente: Reserva | null = null; // Para almacenar la reserva creada en el backend antes del pago
  isReserving: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private funcionService: FuncionesService,
    private reservaService: ReservasService,
    private router: Router,
    private loginservice: LoginService,
    private location: Location,
    private userservice: UsuarioService
  ) { }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.funcionId = params.get('id'); // Obtiene el parámetro 'id' de la URL (ID de la función)
      if (this.funcionId) {

        this.obtenerFuncion(); // Llama al método para obtener los detalles de la función
      } else {
        console.error('No se recibió ID de función en la ruta.');
        alert('Error: No se recibió el ID de la función. Por favor, intente de nuevo.');
        this.router.navigate(['cartelera']);
      }
    });
  }

  obtenerFuncion(): void {
    if (!this.funcionId) return; // Si no hay ID de función, sale del método
    this.funcionService.getFuncion(this.funcionId).subscribe(
      result => {
        this.funcionSeleccionada = result;

        // Genera las butacas en la UI, pasando las butacas ocupadas de la función (o un array vacío si no hay)
        this.generateSeats(this.funcionSeleccionada.butacasOcupadas || []);
      },
      error => {
        this.mostrarMensaje('Error al obtener la función. Por favor, inténtalo de nuevo.', true);
        console.error('Error al obtener la función:', error);
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

 // Método para generar el mapa de butacas para la UI
  generateSeats(occupiedSeatsIds: string[]): void {
    this.butacas = []; // Limpia el array de butacas actual
    this.butacaSeleccionada.clear(); // Limpia las butacas seleccionadas previamente

    this.rows.forEach(rowLetter => { // Itera sobre cada letra de fila (A, B, C...)
      for (let i = 1; i <= this.cols; i++) { // Itera sobre cada número de columna (1, 2, 3...)
        const seatId = `${rowLetter}${i}`; // Crea el ID de la butaca (ej. "A1", "B5")
        // Determina el estado de la butaca: 'occupied' si está en la lista de ocupadas, 'available' de lo contrario
        const status = occupiedSeatsIds.includes(seatId) ? 'occupied' : 'available';
        this.butacas.push({ id: seatId, status: status }); // Añade la butaca al array de butacas de la UI
      }
    });
  }

  // Método para manejar el clic en una butaca
  handleSeatClick(seat: ButacaUI): void {
    if (seat.status === 'available') { // Si la butaca está disponible
      seat.status = 'selected'; // Cambia su estado a seleccionada
      this.butacaSeleccionada.add(seat.id); // Añade el ID de la butaca al conjunto de seleccionadas
    } else if (seat.status === 'selected') { // Si la butaca ya estaba seleccionada
      seat.status = 'available'; // Cambia su estado a disponible
      this.butacaSeleccionada.delete(seat.id); // Elimina el ID de la butaca del conjunto de seleccionadas
    }

  }

  // Método asíncrono para iniciar el proceso de reserva de butacas
  async reservarButacas(): Promise<void> {
    if (this.butacaSeleccionada.size === 0) {
      this.mostrarMensaje('Por favor, selecciona al menos una butaca para reservar.', true);
      alert('Por favor, selecciona al menos una butaca para reservar.');
      return;
    }

    if (!this.funcionId || !this.funcionSeleccionada || !this.funcionSeleccionada._id) {
      this.mostrarMensaje('Error: No se ha cargado la información completa de la función.', true);
      alert('Error: No se ha cargado la información completa de la función.');
      return;
    }
    this.isReserving = true;
    const seatsToReserveArray = Array.from(this.butacaSeleccionada); // Convierte el conjunto de butacas seleccionadas a un array

    // Crea un nuevo objeto de Reserva con los datos necesarios
    const nuevaReserva = new Reserva();
    let loggedInUserId: any=this.loginservice.idLogged();
    nuevaReserva.usuario = loggedInUserId;
    nuevaReserva.funcion = this.funcionSeleccionada; // Asigna la función completa a la reserva
    nuevaReserva.cantidadReservas = seatsToReserveArray.length; // Número de butacas reservadas
    nuevaReserva.fecha = new Date(); // Fecha actual de la reserva
    nuevaReserva.precioFinal = seatsToReserveArray.length * this.funcionSeleccionada.precio; // Calcula el precio final
    nuevaReserva.butacasReservadas = seatsToReserveArray; // Asigna las butacas seleccionadas
    //nuevaReserva.qr = ''; // El QR se puede borrar, sin uso por ahora
    nuevaReserva.pagado = 'pendiente'; // Estado inicial de la reserva: pendiente de pago



    try {
      const response = await this.reservaService.createReserva(nuevaReserva).toPromise();
      this.mostrarMensaje('Reserva creada con éxito. Ahora serás redirigido para el pago.', false);
      this.isReserving = false;


      this.reservaPendiente = response.reserva;

      // Procede al pago si la reserva se creó correctamente y tiene un ID
      if (this.reservaPendiente && this.reservaPendiente._id) {
        this.pagarReserva(this.reservaPendiente); // Llama al método para iniciar el proceso de pago
      } else {
        console.error('No se pudo obtener el ID de la reserva para el pago.');
        this.mostrarMensaje('Error al procesar la reserva para el pago. Intente nuevamente.', true);
      }


    } catch (error: any) {
      this.isReserving = false;
      console.error('Error al realizar la reserva:', error);
      let errorMessage = 'No se pudo completar la reserva. Inténtalo de nuevo.';
      if (error.error && error.error.msg) {
        errorMessage = error.error.msg;
      } else if (error.message) {

        errorMessage = error.message;
      }
      this.mostrarMensaje(errorMessage, true);
    }
    this.isReserving = false;
  }

  // Método para iniciar el proceso de pago con Mercado Pago
  pagarReserva(reserva: Reserva): void {
    // Prepara los detalles del pago para Mercado Pago
    //  let usuarioReserva : any;
    // this.userservice.getUsuario(this.loginservice.idLogged()as string).subscribe((usuario) => {
    //   usuarioReserva = usuario;
    //   console.log('Usuario encontrado:', usuarioReserva);
    // })
      const paymentDetails = {

      payer_email: 'test_user_1178905345@testuser.com', //Reemplazar con el correo electrónico real del usuario
      title: `Reserva de butacas para ${reserva.funcion.pelicula.originalTitle}`, // Título del pago
      description: `Butacas: ${reserva.butacasReservadas.join(', ')} para la función del ${new Date(reserva.funcion.fecha).toLocaleDateString()}`, // Descripción del pago
      quantity: reserva.cantidadReservas, // Cantidad de ítems (butacas)
      unit_price: reserva.funcion.precio, // Precio unitario por butaca
      category_id: 'tickets', // Categoría del pago (ejemplo para entradas de cine)
      reservationId: reserva._id // Pasa el ID de tu reserva al backend para que Mercado Pago lo devuelva como external_reference
    };

    // Llama al servicio para obtener el link de pago de Mercado Pago
    this.reservaService.getPaymentLinkMercadoPago(paymentDetails).subscribe(
      (mpResponse: any) => {
        if (mpResponse && mpResponse.init_point) { // Si la respuesta contiene el punto de inicio de pago
          window.location.href = mpResponse.init_point; // Redirige al usuario al checkout de Mercado Pago
        } else {
          this.mostrarMensaje('No se pudo obtener el link de pago de Mercado Pago.', true);
          alert('No se pudo obtener el link de pago de Mercado Pago.'); // Alerta si no se obtiene el link
          console.error('Respuesta inesperada de Mercado Pago:', mpResponse); // Log de la respuesta inesperada
        }
      },
      (error: any) => {
        console.error('Error al generar el link de pago con Mercado Pago:', error); // Log del error
        this.mostrarMensaje('Error al conectar con Mercado Pago. Inténtalo de nuevo.', true);
        alert('Error al conectar con Mercado Pago. Inténtalo de nuevo.'); // Alerta al usuario
      }
    );
  }

  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    if (esError) {
      console.error('Mensaje de error:', mensaje);
      Swal.fire({
        icon: 'error',
        title: '¡Oops...',
        text: mensaje,
        confirmButtonText: 'Entendido'
      });
    } else {

      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: mensaje,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  }
}
