import { Injectable } from '@angular/core'; 
import { Pelicula } from '../models/pelicula'; 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
 peliculasAgregadas: Pelicula[] = [];
private apiUrl = 'https://backtestbeta.onrender.com'

 constructor(private _http: HttpClient) { }

  //Envía una solicitud POST para agregar una nueva película a la base de datos local
  postPelicula(pelicula: Pelicula): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Convierte el objeto Pelicula a una cadena JSON.
    let body: any = JSON.stringify(pelicula);
    return this._http.post(`${this.apiUrl}/api/pelicula/`, body, httpOptions);
  }

  //Envía una solicitud GET para obtener todas las películas de la base de datos local
  getPeliculas(): Observable<any> {
    let httpOptions = {
      headers: new HttpHeaders()
    }
    return this._http.get(`${this.apiUrl}/api/pelicula/`, httpOptions);
  }

  //Envía una solicitud DELETE para eliminar una película de la base de datos local por su ID  
  deletePelicula(id: string): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }; 
    return this._http.delete(`${this.apiUrl}/api/pelicula/${id}`, httpOptions);
  }

  // Envía una solicitud PUT para actualizar una película existente en la base de datos local 
  editPelicula(pelicula: Pelicula): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    // Realiza la solicitud PUT a la URL de la API para una película específica por su ID,
    // enviando el objeto película completo como cuerpo de la solicitud.
    return this._http.put(`${this.apiUrl}/api/pelicula/${pelicula._id}`, pelicula, httpOptions);
  }

  // Envía una solicitud GET a una API externa (RapidAPI - IMDb) para obtener películas de taquilla 
  public getMovies(): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': 'f7ac652b81msh31de2978fe077e9p130f83jsne6b600a1a991',  
        'X-RapidAPI-Host': 'imdb236.p.rapidapi.com' 
      })
    };
    return this._http.get("https://imdb236.p.rapidapi.com/api/imdb/top-box-office", httpOptions);
  }

  //Envía una solicitud POST a una API externa (RapidAPI - Google Translate) para traducir texto 
  public postMovieTranslate(description: string): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders({
        'x-rapidapi-key': '464cbdd516msh188ba69cecd6233p1f9d05jsnac4f9d82c946',  
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',  
        'Content-Type': 'application/json'  
      }),
    };
 
    const data = {
      from: "en", // Idioma de origen (inglés)
      to: "es", // Idioma de destino (español)
      json: {
        text: description // El texto a traducir
      }
    }; 
    return this._http.post("https://google-translate113.p.rapidapi.com/api/v1/translator/json", data, httpOptions);
  }

  //Envía una solicitud GET a una API externa (RapidAPI - IMDb) para obtener próximos estrenos
  public getNextMovies(): Observable<any> { 
    const httpOptions = {
      headers: new HttpHeaders({
        'X-RapidAPI-Key': '5d856c9addmshc1bc9ebdd3df635p1db278jsn67517ecf5d99',  
        'X-RapidAPI-Host': 'imdb236.p.rapidapi.com' 
      })
    }; 
    return this._http.get("https://imdb236.p.rapidapi.com/api/imdb/upcoming-releases?countryCode=AR&type=MOVIE", httpOptions);
  }
}
