import { Component } from '@angular/core';
//modulos y componentes usados para la realizacion del login 
import { Router} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatTabsModule, MatInputModule, FormsModule,MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'ProgramWebLogin_DEMG';
  inicio_gmail: string = '';
  inicio_contras: string = '';
  reg_email: string = '';
  reg_contras: string = '';
  reg_conf_contras: string = '';
  hideContras: boolean = true;
  currentUserAvatar: string | null = null;
  currentNombreAvatar: string | null = null;
  constructor(private router: Router, private userService: UserService) {}
  //logica para ingresar,registrar y ver contraseña
  ingresar() {
    // obtener usuarios con la api
    this.userService.getUsers().subscribe(
     (users) => {
       const validUser = users.find(
         user => user.email === this.inicio_gmail && user.password === this.inicio_contras
       );
       //validar contraseña y gmail
       //si son correctos
       if (validUser) {
        //almacenar localmente
        this.userService.setUsuarioUso(validUser); 
        alert('Inicio de sesión exitoso');
        this.router.navigate(['/home']);  
       } else {
         console.log('Correo o contraseña incorrectos');
         alert('Correo o contraseña incorrectos. Intente de nuevo.');
       }
       // ver usuarios y contraseñas en consola
       const userCredentials = users.map(user => ({
         email: user.email,
         password: user.password
       }));
       console.log('Correos y contraseñas:', userCredentials);
     },
     (error) => {
       console.error('Error al obtener usuarios:', error);
     }
   );
   
 }
  registrar() {
   console.log('Registrando usuario...');
 }
  verContrase() {
   this.hideContras = !this.hideContras;
  }
}

