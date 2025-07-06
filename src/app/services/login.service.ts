import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { UsuarioService } from './usuario.service';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  hostBase: string;
  usuarioLogueado: Usuario | null = null;

  constructor(private _http: HttpClient,private usuarioService: UsuarioService) {
    this.hostBase = 'http://localhost:3000/api/usuario/';
  }
  
  public login(login: string, password: string): Observable<any> {
  const httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  let body = JSON.stringify({ login: login, password: password });
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
    
    return rol && rol.toLowerCase() === 'administrador' ;
  }
  public isAuditor() {
    var rol = sessionStorage.getItem('rol');
    
    return rol && rol.toLowerCase() === 'auditor';
  }
  public isRoot() {
    var rol = sessionStorage.getItem('rol');
    
    return rol && rol.toLowerCase() === 'root';
  }
  public isSupervisor() {
    var rol = sessionStorage.getItem('rol');
    
    return rol && rol.toLowerCase() === 'supervisor';
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

  verifyGoogleToken(token: string): Observable<any> {
    const httpOption = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        }),
    };
    return this._http.post(this.hostBase + 'google-login', { id_token: token }, httpOption);
}

}
