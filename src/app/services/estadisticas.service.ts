import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = 'https://backtestrender.onrender.com'
  constructor(private http: HttpClient) { }

  getVentaBoletosSemanales() {
    return this.http.get(`${this.apiUrl}/api/reserva/resumensemanal`);
  }
  getIngresosSemanales() {
    return this.http.get(`${this.apiUrl}/api/reserva/ingresossemanal`);
  }
  getAsistenciaFunciones() {
    return this.http.get(`${this.apiUrl}/api/reserva/asistenciafuncion`);
  }
  getVentasPorPelicula() {
    return this.http.get(`${this.apiUrl}/api/reserva/ventaspelicula`);
  }
  getventasultimoMes() {
    return this.http.get(`${this.apiUrl}/api/reserva/ventasultimomes`);
  }
  getfuncionesDisponibles() {
    return this.http.get(`${this.apiUrl}/api/funcion/countactivas`);
  }
  getIngresosAnuales() {
    return this.http.get(`${this.apiUrl}/api/reserva/ingresosanuales`);
  }
  public getFuncionesDisponiblesCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/funcion/activas/count`);
  }
}
