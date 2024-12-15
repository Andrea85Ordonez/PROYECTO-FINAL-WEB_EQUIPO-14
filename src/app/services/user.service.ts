import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api/usuarios';
  private usuarioClave = 'usuarioActual';
  constructor(private http: HttpClient) {}

  // obtener los usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
        console.log(data);
      })
    );
  }
  // agregar un nuevo usuario
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      tap((data) => {
        console.log('Usuario agregado:', data);
      })
    );
  }
  // editar un usuario existente
  editUser(userId: number, updatedUser: any): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.put<any>(url, updatedUser).pipe(
      tap((data) => {
        console.log('Usuario editado:', data);
      })
    );
  }
  // eliminar un usuario
  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        console.log('Usuario eliminado');
      })
    );
  }
  // guardar usuario localmente
  setUsuarioUso(user: any): void {
    if (this.localStorageDisponible()) {
      localStorage.setItem(this.usuarioClave, JSON.stringify(user));
    } else {
      console.warn('localStorage no está disponible. No se pudo guardar el usuario.');
    }
  }
  // obtener usuario localmente
  getUsuarioUso(): any {
    if (this.localStorageDisponible()) {
      const usuarioGuardado = localStorage.getItem(this.usuarioClave);
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }
    console.warn('localStorage no está disponible');
    return null;
  }

  // Limpiar cuando se cierra sesión
  limpiarUsuarioUso(): void {
    if (this.localStorageDisponible()) {
      localStorage.removeItem(this.usuarioClave);
    } else {
      console.warn('localStorage no está disponible');
    }
  }

  // Comprobar disponibilidad de localStorage
  private localStorageDisponible(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
}
