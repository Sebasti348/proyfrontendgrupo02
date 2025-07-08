import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'https://proybackendgrupo02.onrender.com'

  constructor(private http: HttpClient) { }

  // Reporte de Ventas
  getVentasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/reserva/reporte`);
  }

  // Reporte de Películas
  getPeliculasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/reserva/reporte-peliculas`);
  }

  // Reporte de Funciones
  getFuncionesReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/reserva/reporte-funciones`);
  }

  // Reporte de Reservas
  getReservasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/reserva/reporte-reservas`);
  }

  // Filtros
  filtrarReporte(fechaInicio: string, fechaFin: string, tipo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/reserva/reporte/filtrar`, {
      params: {
        fechaInicio,
        fechaFin,
        tipo
      }
    });
  }
}
