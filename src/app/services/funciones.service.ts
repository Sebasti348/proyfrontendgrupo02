import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Funcion } from '../models/funcion';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  private apiUrl = 'https://backtestbeta.onrender.com'

  constructor(private _http: HttpClient) { }

  //Obtiene todas las funciones
  public getFunciones(): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/funcion/`);
  }

  //Obtiene todas las funciones que están activas
  public getFuncionesActivas(): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/funcion/activas/`);
  }

  //El objeto Funcion a crear
  public postFuncion(funcion: Funcion): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this._http.post(`${this.apiUrl}/api/funcion/`, funcion, httpOptions);
  }

  //Edita una función existente
  editFuncion(funcion: Funcion): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this._http.put(`${this.apiUrl}/api/funcion/${funcion._id}`, funcion, httpOptions);
  }

  //Elimina una función por su ID
  deleteFuncion(id: string): Observable<any> {
    return this._http.delete(`${this.apiUrl}/api/funcion/${id}`);
  }

  //Obtiene una función específica por su ID
  public getFuncion(funcionId: any): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/funcion/` + funcionId);
  }

 //Obtiene funciones filtradas por nombre de película
  public getFuncionByName(funcionName: any): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/funcion/pelicula/` + funcionName);
  }

  //Obtiene funciones filtradas por fecha
  public getFuncionByDate(fecha: string): Observable<any> {
    return this._http.get(`${this.apiUrl}/api/funcion/por-fecha/${fecha}`);
  }
}