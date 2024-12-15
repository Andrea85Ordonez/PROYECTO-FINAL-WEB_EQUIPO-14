import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  user: any;

  constructor(private usuarioAutentificado: UserService) {}

  ngOnInit(): void {
    this.user = this.usuarioAutentificado.getUsuarioUso();
  }
  cerrarSesion(): void {
    this.usuarioAutentificado.limpiarUsuarioUso();
    this.user = null;
  }
}
