import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private apiUrl = 'https://backtestbeta.onrender.com'
  // UUID de una plantilla de Placid.app, probablemente usada para generar tickets.
  templateUUID: string = '23ue9vqiif2ss';

  constructor(private _http: HttpClient) {

  }

  //Envía una solicitud GET para obtener todas las reservas de la base de datos local
  public getReservas(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/api/reserva`, httpOptions);
  }

  //Envía una solicitud GET para obtener una reserva específica de la base de datos local por su ID 
  public getReserva(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.get(`${this.apiUrl}/api/reserva/${id}`, httpOptions);
  }

  //Envía una solicitud POST para crear una nueva reserva en la base de datos local 
  public createReserva(reserva: Reserva): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/api/reserva/`, JSON.stringify(reserva), httpOptions);
  }

  //Envía una solicitud PUT para actualizar una reserva existente en la base de datos local 
  public editReserva(id: string, reserva: Reserva): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud PUT a la URL de la API para una reserva específica por su ID,
    // enviando el objeto reserva completo como cuerpo de la solicitud.
    return this._http.put(`${this.apiUrl}/api/reserva/${id}`, JSON.stringify(reserva), httpOptions);
  }

  //Envía una solicitud DELETE para eliminar una reserva de la base de datos local por su ID 
  public deleteReserva(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders()
    };
    return this._http.delete(`${this.apiUrl}/api/reserva/${id}`, httpOptions);
  }

  // Envía una solicitud POST a tu backend para obtener un enlace de pago de Mercado Pago. Un objeto con los detalles necesarios para el pago (ej. email del pagador, título, descripción, cantidad, precio unitario, ID de la reserva)
  public getPaymentLinkMercadoPago(paymentDetails: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/api/mp/payment`, paymentDetails, httpOptions);
  }

  //Envía una solicitud POST a tu backend para generar un ticket visual utilizando Placid.app 
  postTicketPlacid(reservaId: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const bodyToSend = { reservaId: reservaId };

    // Llama a tu endpoint de backend para generar el ticket Placid.
    // La ruta esperada en el backend es `/reserva/generar-ticket-placid`.
    return this._http.post(`${this.apiUrl}/api/reserva/generar-ticket-placid`, bodyToSend, httpOptions);
  }
}
