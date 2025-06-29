import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  hostBase: string;
  constructor(private _http: HttpClient) {
    this.hostBase = 'http://localhost:3000/api/usuario/';
  }
  public login(email: string, password: string): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    let body = JSON.stringify({ email: email, password: password });
    console.log(body);
    return this._http.post(this.hostBase + 'login', body, httpOption);
  }
  public logout() {
    //borro el vble almacenado mediante el storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('userid');
  }
  public userLoggedIn() {
    var resultado = false;
    var usuario = sessionStorage.getItem('user');
    if (usuario != null) {
      resultado = true;
    }
    return resultado;
  }
  public userLogged() {
    var usuario = sessionStorage.getItem('user');
    return usuario;
  }
  public idLogged() {
    var id = sessionStorage.getItem('userid');
    return id;
  }
  
  public userRole() {
    var rol = sessionStorage.getItem('rol');
    return rol;
  }
  
  public isAdmin() {
    var rol = sessionStorage.getItem('rol');
    console.log('Rol actual:', rol);
    return rol && rol.toLowerCase() === 'administrador';
  }

  validarNuevoUsuario(usuario: Usuario): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let body:any = JSON.stringify(usuario);
    return this._http.post('http://localhost:3000/api/usuario/validator', body, httpOptions);
  }

}
