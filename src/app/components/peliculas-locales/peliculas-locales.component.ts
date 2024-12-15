  import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
  import { peliculaslocalService } from '../../services/peliculas-local.service';
  import { CommonModule } from '@angular/common';
  import { PaginacionComponent } from '../../paginacion/paginacion.component';
  import { MatDialog, MatDialogModule } from '@angular/material/dialog'; 
  import { MatButtonModule } from '@angular/material/button';
  import { MatIconModule } from '@angular/material/icon';
  import { FormsModule } from '@angular/forms';
  import {MatCardModule} from '@angular/material/card';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';

  @Component({
    selector: 'app-pelicula-local',
    standalone: true,
    imports: [CommonModule, PaginacionComponent, MatDialogModule,MatButtonModule,MatIconModule,FormsModule,MatCardModule,
    MatFormFieldModule,MatInputModule],
    templateUrl: './peliculas-locales.component.html',
    styleUrls: ['./peliculas-locales.component.css']
  })
  export class PeliculasLocalesComponent implements OnInit {
    //para obtener las peliculas que se muestran en la tabla
    peliculas: any[] = []; 
    //peliculas para el buscador
    todasPeliculas: any[] = []; 
    //para la paginacion
    paginaPeliculas: any[] = [];  
    paginacionInicial: number = 10; 
    currentPage: number = 1; 
    //para editar
    peliculaSeleccionada: any; 
    //para editar la pelicula
    editMovie: any = {}; 
    buscador: any;
    //constructructor para guardar el usuario
    constructor(private peliculasService: peliculaslocalService,public dialog: MatDialog ) {}
    ngOnInit(): void {
      //obtener las peliculas
      this.peliculasService.getPeliculasLocales().subscribe(
        (response: any[]) => {
          //como se devuelven varios areglos por lo que se unieron la busqueda de peliculas de distintos años se convinan con flatMap
          this.todasPeliculas = response; 
          this.peliculas = [...this.todasPeliculas];
          //para la paginacion
          this.modificarPaginacionPeliculas();  
        },
        (error: any) => {
          console.error('Error al obtener las películas:', error);
        }
      );
    }
    // para el cambio de página
    onPageChange(event: any): void {
      this.currentPage = event.pageIndex + 1; 
      this.paginacionInicial = event.pageSize;
      this.modificarPaginacionPeliculas();  
    }
    // actualizar peliculas segun la pagina
    modificarPaginacionPeliculas(): void {
      const peliculaInicial = (this.currentPage - 1) * this.paginacionInicial;
      const peliculaFinal = this.currentPage * this.paginacionInicial;
      this.paginaPeliculas = this.peliculas.slice(peliculaInicial, peliculaFinal);
      //para el id de la pelicula
      this.paginaPeliculas = this.paginaPeliculas.map((movie, index) => ({
      ...movie,
      idPelicula: peliculaInicial + index + 1, 
    }));
    }
    //PARA EL MODAL DE LOS DETALLES
    @ViewChild('modalDetalles') ModalVerDetalles!: TemplateRef<any>;  
    abrirModal(movie: any): void {
      this.peliculaSeleccionada = movie;
      this.dialog.open(this.ModalVerDetalles);
    }
    //cerrar el modal
    cerrarModal(): void {
      this.dialog.closeAll(); 
    }
    //PARA EL MODAL DE EDITAR
    @ViewChild('modalEditar') ModalEditarDetalles!: TemplateRef<any>;
    abrirEditModal(movie: any): void {
      this.editMovie = { ...movie }; 
      this.dialog.open(this.ModalEditarDetalles);
    }
    cerrarEditModal(): void {
      this.dialog.closeAll(); 
    }
    //actualizar tabla
    // peliculas-locales.component.ts

guardarCambios(): void {
  const index = this.peliculas.findIndex(
    (movie) => movie.id === this.editMovie.id  
  );
  
  if (index !== -1) {
    // servicio para actualizar la peli
    this.peliculasService.updatePelicula(this.editMovie.id, this.editMovie).subscribe(
      (response) => {
        // actualizar tabla
        this.peliculas[index] = { ...this.editMovie };
        //modificar paginacion  
        this.modificarPaginacionPeliculas();  
        this.dialog.closeAll();  
      },
      (error) => {
        console.error('Error al guardar los cambios:', error);
      }
    );
  }
}

    //PARA ELIMINAR
    @ViewChild('modalConfirmarEliminacion') confEliminarModal!: TemplateRef<any>; 
    peliculaEliminada: any; 
    abrirEliminarModal(movie: any): void {
      this.peliculaEliminada = movie; 
      this.dialog.open(this.confEliminarModal); 
    }
    cerrarEliminarModal(): void {
      this.dialog.closeAll(); 
    }
    // peliculas-locales.component.ts

confirmEliminacion(): void {
  if (this.peliculaEliminada) {
    // se llama al metodo de eliminar del servicio
    this.peliculasService.deletePelicula(this.peliculaEliminada.id).subscribe(
      (response) => {
        // se filtran las peliculas
        this.peliculas = this.peliculas.filter(
          (movie) => movie.id !== this.peliculaEliminada.id
        );
        //para gainacion
        this.modificarPaginacionPeliculas();  
        this.peliculaEliminada = null;
        this.dialog.closeAll();  
      },
      (error) => {
        console.error('Error al eliminar la película:', error);
      }
    );
  }
}

    buscar(): void {
      const term = this.buscador?.trim().toLowerCase() || ''; 
      //si no se busca nada
      if (term === '') {
        this.peliculas = [...this.todasPeliculas];
      } else {
        this.peliculas = this.todasPeliculas.filter((peli) =>
          peli.titulo.toLowerCase().includes(term)
        );
      }
      this.modificarPaginacionPeliculas();
    }
    @ViewChild('modalAgregar') ModalAgregar!: TemplateRef<any>;

nuevaPelicula: any = {}; 

abrirAgregarModal(): void {
  this.nuevaPelicula = {};  
  this.dialog.open(this.ModalAgregar);
}

cerrarAgregarModal(): void {
  this.dialog.closeAll();
}
agregarPelicula(): void {
  this.peliculasService.agregarPelicula(this.nuevaPelicula).subscribe(
    (response) => {
      // Si la API responde exitosamente, actualizamos la lista
      this.todasPeliculas.push(response);
      this.peliculas = [...this.todasPeliculas];  
      this.modificarPaginacionPeliculas();  
      this.dialog.closeAll();
    },
    (error) => {
      console.error('Error al agregar la película:', error);
    }
  );
}


  }
  