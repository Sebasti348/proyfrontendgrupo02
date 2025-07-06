import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Reporte de Ventas
  getVentasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserva/reporte`);
  }

  // Reporte de Películas
  getPeliculasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserva/reporte-peliculas`);
  }

  // Reporte de Funciones
  getFuncionesReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserva/reporte-funciones`);
  }

  // Reporte de Reservas
  getReservasReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reserva/reporte-reservas`);
  }

  // Filtros
  filtrarReporte(fechaInicio: string, fechaFin: string, tipo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/reporte/filtrar`, {
      params: {
        fechaInicio,
        fechaFin,
        tipo
      }
    });
  }
}
