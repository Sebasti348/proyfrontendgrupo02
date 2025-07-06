import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservasService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-pago-exitoso',
  templateUrl: './pago-exitoso.component.html',
  imports: [CommonModule],
  styleUrls: ['./pago-exitoso.component.css']
})

export class PagoExitosoComponent implements OnInit {
  paymentId: string | null = null;
  paymentStatus: string | null = null;
  externalReference: string | null = null;
  loading: boolean = true;
  message: string = 'Procesando tu pago...';
  imageUrl: string | null = null;
  error: string | null = null;
  reservaDetalles: Reserva | null = null;
  qrTicketUrl: string | null = null;

  constructor(
    private reservasService: ReservasService,
    private route: ActivatedRoute,
    public router: Router
  ) { }

  // Método del ciclo de vida que se ejecuta cuando el componente se inicializa
  ngOnInit(): void {
    // Código comentado que originalmente manejaba los parámetros de la URL de Mercado Pago.
    // Se ha comentado para permitir la llamada directa a generarTicketPlacid con un ID fijo para pruebas.

    // this.route.queryParams.subscribe(params => {
    //   this.paymentId = params['collection_id'] || params['payment_id'];
    //   this.paymentStatus = params['collection_status'] || params['status'];
    //   this.externalReference = params['external_reference']; // Captura la referencia externa (reservaId)

    //   if (this.paymentId && this.paymentStatus === 'approved') {
    //     this.message = '¡Tu pago ha sido aprobado!';
    //     // Si el pago es aprobado y tenemos la referencia externa (ID de la reserva),
    //     // procedemos a cargar los detalles de la reserva y luego a generar el ticket Placid.
    //     if (this.externalReference) {
    //       this.cargarDetallesReserva(this.externalReference); // Llama a la función para cargar detalles
    //     } else {
    //       this.message = 'Pago aprobado, pero no se encontró la referencia de la reserva.';
    //       this.loading = false;
    //       this.error = 'No se pudo procesar: ID de reserva faltante.';
    //     }
    //   } else if (this.paymentStatus === 'pending') {
    //     this.message = 'Tu pago está pendiente. Te notificaremos cuando se complete.';
    //     this.loading = false;
    //   } else if (this.paymentStatus === 'rejected' || this.paymentStatus === 'failure') {
    //     this.message = 'Tu pago ha sido rechazado. Por favor, intenta de nuevo.';
    //     this.loading = false;
    //   } else {
    //     this.message = 'No se pudo determinar el estado del pago.';
    //     this.loading = false;
    //   }
    // });

    // this.generarTicketPlacid(); // Llamada inicial para generar el ticket Placid (con ID fijo para pruebas)
  }

  // Método para cargar los detalles de una reserva específica
  cargarDetallesReserva(reservaId: string): void {
    this.message = 'Cargando detalles de tu reserva...'; // Actualiza el mensaje al usuario
    this.loading = true; // Activa el indicador de carga
    this.error = null; // Limpia cualquier error previo

    // Llama al servicio de reservas para obtener los detalles de la reserva por su ID
    this.reservasService.getReserva(reservaId).subscribe({
      next: (reserva) => {
        this.reservaDetalles = reserva; // Almacena los detalles de la reserva
        this.message = 'Detalles de la reserva cargados. Generando tu ticket...'; // Actualiza el mensaje
        // Una vez que los detalles de la reserva se han cargado, procede a generar el ticket Placid
        this.generarTicketPlacid(reservaId);
      },
      error: (err) => {
        console.error('Error al cargar los detalles de la reserva:', err); // Log del error
        this.error = err.error?.msg || 'Error al cargar los detalles de la reserva.'; // Mensaje de error para el usuario
        this.message = 'Ocurrió un error al cargar la reserva.'; // Mensaje de estado
        this.loading = false; // Desactiva el indicador de carga
      }
    });
  }

  // UsO un ID de reserva fijo para pruebas si no se proporciona uno, luego con los pagos reales se debe borrar
  generarTicketPlacid(reservaId: string = "6869837b14841f114f60f08c"): void {
    this.message = 'Generando tu ticket...'; // Actualiza el mensaje al usuario
    this.error = null; // Limpia errores previos

    // Llama al servicio de reservas para solicitar la generación del ticket Placid
    this.reservasService.postTicketPlacid(reservaId).subscribe({
      next: (response) => {
        // Verifica si la respuesta es exitosa y contiene una URL de imagen
        if (response.status === '1' && response.image_url) {
          this.imageUrl = response.image_url; // Almacena la URL de la imagen del ticket
          this.message = '¡Ticket generado con éxito! Aquí está tu ticket:'; // Mensaje de éxito
          this.loading = false; // Desactiva el indicador de carga
        } else {
          this.error = response.msg || 'Error desconocido al generar el ticket.'; // Mensaje de error si la respuesta no es la esperada
          this.message = 'Ocurrió un error al generar el ticket.'; // Mensaje de estado
          this.loading = false; // Desactiva el indicador de carga
        }
      },
      error: (err) => {
        console.error('Error al generar el ticket Placid:', err); // Log del error
        this.error = err.error?.msg || 'Error de conexión al generar el ticket.'; // Mensaje de error para el usuario
        this.message = 'Ocurrió un error al generar el ticket.'; // Mensaje de estado
        this.loading = false; // Desactiva el indicador de carga
      }
    });
  }

  // Método para generar un código QR a partir de la URL del ticket
  generarQrTicket(): void {
    if (this.imageUrl) { // Solo genera el QR si hay una URL de imagen de ticket
      const baseUrl = "https://api.qrserver.com/v1/create-qr-code/"; // URL base del servicio de QR

      // Codifica la URL del ticket para que sea segura en la URL del QR
      const encodedTicketUrl = encodeURIComponent(this.imageUrl);

      // Construye la URL completa del QR con la URL del ticket, tamaño y colores
      this.qrTicketUrl = `${baseUrl}?data=${encodedTicketUrl}&size=200x200&color=000000&bgcolor=FFFFFF`;
      console.log('QR del Ticket generado:', this.qrTicketUrl); // Log de la URL del QR
    } else {
      console.warn('No hay una URL de imagen de ticket para generar el QR.'); // Advertencia si no hay URL de ticket
      this.qrTicketUrl = null; // Asegura que no se muestre un QR vacío
    }
  }

  // Método para navegar a la cartelera
  irInicio(): void {
    this.router.navigate(['cartelera']);
  }
}
