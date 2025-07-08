import { Funcion } from "./funcion";

export class Reserva {
    _id?: string;
    usuario: string | null ;
    funcion: Funcion;
    cantidadReservas: number;
    fecha: Date;
    precioFinal: number;
    butacasReservadas: string[];
    //Se puede eliminar el QR, no se usa por ahora
    qr: string;
    // Se agregaron para la imagen del ticket y el estado de pago que cambia con Mercado Pago
    imagen: string;
    pagado: string; // 'pendiente', 'pagado', 'rechazado'

    constructor() {
        this.usuario = '';
        this.funcion = new Funcion(); 
        this.cantidadReservas = 0;
        this.fecha = new Date();
        this.precioFinal = 0;
        this.butacasReservadas = [];
        this.qr = '';
        this.imagen = ''; 
        this.pagado = 'pagado'; // Estado inicial de la reserva antes del pago
    }
}