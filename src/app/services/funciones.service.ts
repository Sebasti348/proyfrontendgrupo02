import { HttpClient, HttpHeaders } from '@angular/common/http'; // Eliminado HttpParams ya que no se usa
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcion } from '../models/funcion';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  apiUrl: string = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  // Simplificado: no se necesitan HttpHeaders vacíos para GET
  public getFunciones(): Observable<any> {
    return this._http.get(`${this.apiUrl}/funcion/`);
  }

  // Simplificado: no se necesitan HttpHeaders vacíos para GET
  public getFuncionesActivas(): Observable<any> {
    return this._http.get(`${this.apiUrl}/funcion/activas/`);
  }

  // Simplificado: no se necesita JSON.stringify, HttpClient lo hace automáticamente
  public postFuncion(funcion: Funcion): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/funcion/`, funcion, httpOptions);
  }

  // Simplificado: no se necesitan HttpHeaders vacíos para GET
  public getFuncion(funcionId: any): Observable<any> {
    return this._http.get(`${this.apiUrl}/funcion/` + funcionId);
  }

  
}