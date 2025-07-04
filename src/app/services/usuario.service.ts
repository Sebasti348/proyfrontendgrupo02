import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuarios():Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        
      }),
      params: new HttpParams()
    }
    return this.http.get('http://localhost:3000/api/usuario/');
  }
  getUsuariosByRole(role: string):Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        
      }),
      params: new HttpParams()
    }
    return this.http.get(`http://localhost:3000/api/usuario/rol/${role}`);
  }

  getUsuario(id: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        
      }),
      params: new HttpParams()
    }
    return this.http.get(`http://localhost:3000/api/usuario/${id}`);
  }
  getUsuarioByEmail(email: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        
      }),
      params: new HttpParams()
    }
    return this.http.get(`http://localhost:3000/api/usuario/buscar/${email}`);
  }

  createUsuario(usuario: Usuario): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let body:any = JSON.stringify(usuario);
    return this.http.post('http://localhost:3000/api/usuario/', body, httpOptions);
  }

  updateUsuario(id: number, usuario: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body:any = JSON.stringify(usuario);
    return this.http.put(`http://localhost:3000/api/usuario/${id}`, usuario);
  }

  deleteUsuario(id: number, usuario : any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    let body:any = JSON.stringify(usuario);
    
    return this.http.delete(`http://localhost:3000/api/usuario/${id}`, usuario);
  }

  getReservasByUser(id: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        
      }),
      params: new HttpParams()
    }
    return this.http.get(`http://localhost:3000/api/reserva/buscar/${id}`);
  }
}
