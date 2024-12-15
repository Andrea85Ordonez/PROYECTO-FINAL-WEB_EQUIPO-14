import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { PaginacionComponent } from '../../paginacion/paginacion.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, PaginacionComponent, MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatCardModule, MatFormFieldModule,MatInputModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  usuarios: any[] = [];
  todosUsuarios: any[] = [];
  paginaUsuarios: any[] = [];
  paginacionInicial: number = 10;
  currentPage: number = 1;
  usuarioSeleccionado: any;
  editUser: any = {};
  buscador: any;
  nuevoUsuario: any = {};
  usuarioEliminado: any;

  constructor(private usuariosService: UserService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.usuariosService.getUsers().subscribe(
      (response: any[]) => {
        this.todosUsuarios = response;
        this.usuarios = [...this.todosUsuarios];
        this.modificarPaginacionUsuarios();
      },
      (error: any) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.paginacionInicial = event.pageSize;
    this.modificarPaginacionUsuarios();
  }

  modificarPaginacionUsuarios(): void {
    const usuarioInicial = (this.currentPage - 1) * this.paginacionInicial;
    const usuarioFinal = this.currentPage * this.paginacionInicial;
    this.paginaUsuarios = this.usuarios.slice(usuarioInicial, usuarioFinal).map((user, index) => ({
      ...user,
      idUsuario: usuarioInicial + index + 1,
    }));
  }

  @ViewChild('modalDetalles') ModalVerDetalles!: TemplateRef<any>;
  abrirModal(user: any): void {
    this.usuarioSeleccionado = user;
    this.dialog.open(this.ModalVerDetalles);
  }
  cerrarModal(): void {
    this.dialog.closeAll();
  }

  @ViewChild('modalEditar') ModalEditarDetalles!: TemplateRef<any>;
  abrirEditModal(user: any): void {
    this.editUser = { ...user };
    this.dialog.open(this.ModalEditarDetalles);
  }
  cerrarEditModal(): void {
    this.dialog.closeAll();
  }

  guardarCambios(): void {
    const index = this.usuarios.findIndex((user) => user.id === this.editUser.id);
    if (index !== -1) {
      this.usuariosService.editUser(this.editUser.id, this.editUser).subscribe(
        (response) => {
          this.usuarios[index] = { ...this.editUser };
          this.modificarPaginacionUsuarios();
          this.dialog.closeAll();
        },
        (error) => {
          console.error('Error al guardar cambios:', error);
        }
      );
    }
  }

  @ViewChild('modalConfirmarEliminacion') confEliminarModal!: TemplateRef<any>;
  abrirEliminarModal(user: any): void {
    this.usuarioEliminado = user;
    this.dialog.open(this.confEliminarModal);
  }
  cerrarEliminarModal(): void {
    this.dialog.closeAll();
  }

  confirmEliminacion(): void {
    if (this.usuarioEliminado) {
      this.usuariosService.deleteUser(this.usuarioEliminado.id).subscribe(
        () => {
          this.usuarios = this.usuarios.filter((user) => user.id !== this.usuarioEliminado.id);
          this.modificarPaginacionUsuarios();
          this.usuarioEliminado = null;
          this.dialog.closeAll();
        },
        (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      );
    }
  }

  buscar(): void {
    const term = this.buscador?.trim().toLowerCase() || '';
    if (term === '') {
      this.usuarios = [...this.todosUsuarios];
    } else {
      this.usuarios = this.todosUsuarios.filter((user) => user.name.toLowerCase().includes(term));
    }
    this.modificarPaginacionUsuarios();
  }

  @ViewChild('modalAgregar') ModalAgregar!: TemplateRef<any>;
  abrirAgregarModal(): void {
    this.nuevoUsuario = {};
    this.dialog.open(this.ModalAgregar);
  }
  cerrarAgregarModal(): void {
    this.dialog.closeAll();
  }

  agregarUsuario(): void {
    this.usuariosService.addUser(this.nuevoUsuario).subscribe(
      (response) => {
        this.todosUsuarios.push(response);
        this.usuarios = [...this.todosUsuarios];
        this.modificarPaginacionUsuarios();
        this.dialog.closeAll();
      },
      (error) => {
        console.error('Error al agregar usuario:', error);
      }
    );
  }
}
