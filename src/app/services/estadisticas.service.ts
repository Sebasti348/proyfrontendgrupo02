import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(private http: HttpClient) { }

  getVentaBoletosSemanales() {
    return this.http.get("http://localhost:3000/api/reserva/resumensemanal");
  }
  getIngresosSemanales() {
    return this.http.get("http://localhost:3000/api/reserva/ingresossemanal");
  }
  getAsistenciaFunciones() {
    return this.http.get("http://localhost:3000/api/reserva/asistenciafuncion");
  }
  getVentasPorPelicula() {
    return this.http.get("http://localhost:3000/api/reserva/ventaspelicula");
  }
  getventasultimoMes() {
    return this.http.get("http://localhost:3000/api/reserva/ventasultimomes");
  }
  getfuncionesDisponibles() {
    return this.http.get("http://localhost:3000/api/funcion/countactivas");
  }
  getIngresosAnuales() {
    return this.http.get("http://localhost:3000/api/reserva/ingresosanuales");
  }
  public getFuncionesDisponiblesCount(): Observable<any> {
    return this.http.get("http://localhost:3000/api/funcion/activas/count");
  }
}
