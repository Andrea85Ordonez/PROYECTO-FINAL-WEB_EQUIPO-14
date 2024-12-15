import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class peliculaslocalService {
  private apiUrl = 'http://127.0.0.1:8000/api/peliculas';
  constructor(private http: HttpClient) {}
  getPeliculasLocales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
        console.log(data); 
      })
    );
  }
  updatePelicula(id: number, pelicula: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, pelicula);
  }
  deletePelicula(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
  } 
  agregarPelicula(pelicula: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pelicula);
  }
}
