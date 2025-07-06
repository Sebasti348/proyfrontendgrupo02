import { Component, OnInit } from '@angular/core';
import { Pelicula } from '../../models/pelicula';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PeliculasService } from '../../services/peliculas.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestion-peliculas',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-peliculas.component.html',
  styleUrl: './gestion-peliculas.component.css'
})

export class GestionPeliculasComponent implements OnInit {

  peliculas: Pelicula[] = [];
  peliculasAgregadas: Pelicula[] = [];
  peliculaAEditar: Pelicula | null = null;

  constructor(private peliculaService: PeliculasService) { }

  ngOnInit() {
    this.mostrarPeliculasBD();
  }

  obtenerPeliculas() {
    this.peliculaService.getMovies().subscribe(
      result => {
        // Mapea los resultados de la API externa a objetos Pelicula
        this.peliculas = result.map((item: any) => {
          const peli = new Pelicula();
          peli.originalTitle = item.originalTitle;
          peli.description = item.description;
          peli.releaseDate = item.releaseDate;
          peli.trailer = item.trailer;
          peli.primaryImage = item.thumbnails && item.thumbnails[1] ? item.thumbnails[1].url : 'assets/placeholder-movie.png';
          return peli;
        });

        // Itera sobre las películas obtenidas para traducir sus descripciones
        this.peliculas.forEach((peli) => {
          this.peliculaService.postMovieTranslate(peli.description).subscribe(
            result => {
              peli.description = result.trans.text; // Actualiza la descripción con la traducción
            },
            error => {
              console.error('Error al traducir:', peli.originalTitle, error);
              peli.description = 'Descripción no disponible.';
            }
          );
        });
        console.log('Películas obtenidas de la API externa:', this.peliculas);
      },
      error => {
        console.error('Error al obtener películas de la API externa:', error);
        this.mostrarMensaje('Error al obtener películas de la API externa.', true);
      }
    );
  }

  mostrarPeliculasBD() {
    this.peliculaService.getPeliculas().subscribe(
      result => {
        this.peliculasAgregadas = result.map((item: any) => {
          const peli = new Pelicula();
          peli._id = item._id;
          peli.originalTitle = item.originalTitle;
          peli.description = item.description;
          peli.releaseDate = item.releaseDate;
          peli.trailer = item.trailer;
          peli.primaryImage = item.primaryImage;
          return peli;
        });
        console.log('Películas obtenidas de la BD:', this.peliculasAgregadas);
      },
      error => {
        console.error('Error al obtener películas de la BD:', error);
        this.mostrarMensaje('Error al obtener películas de la base de datos.', true);
      }
    );
  }

  agregarPelicula(pelicula: Pelicula) {
    this.peliculaService.postPelicula(pelicula).subscribe({
      next: (result) => {
        console.log('Respuesta del servidor al agregar película:', result);
        if (result.status === '1') {
          this.mostrarMensaje('¡Película agregada con éxito!', false);
          this.mostrarPeliculasBD();
          console.log('Película agregada:', pelicula);
        } else {
          this.mostrarMensaje('Algo salió mal al agregar la película. Por favor, inténtelo de nuevo.', true);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al agregar película:', err);
        if (err.status === 409) {
          this.mostrarMensaje('Error: ¡Esta película ya está agregada en la base de datos!', true);
        } else if (err.status === 400) {
          this.mostrarMensaje('Error al agregar la película. Verifique los datos enviados.', true);
        } else {
          this.mostrarMensaje('Error inesperado al intentar agregar la película. Por favor, intente más tarde.', true);
        }
      },
      complete: () => {
        console.log('Operación de agregar película completada.');
      }
    });
  }

  eliminarPelicula(pelicula: Pelicula) {
    if (pelicula._id) {
      // Usamos la función mostrarConfirmacion
      this.mostrarConfirmacion(
        '¿Estás seguro?',
        `¡No podrás revertir la eliminación de "${pelicula.originalTitle}"!`,
        'warning'
      ).then((confirmado) => {
        if (confirmado) {
          // Si el usuario confirma, procedemos con la eliminación
          this.peliculaService.deletePelicula(pelicula._id!).subscribe({
            next: () => {
              this.mostrarMensaje('Película eliminada con éxito.', false);
              this.mostrarPeliculasBD();
            },
            error: (err: HttpErrorResponse) => {
              console.error('Error al eliminar película:', err);
              this.mostrarMensaje('Error al eliminar la película. Consulte la consola para más detalles.', true);
            }
          });
        } else {
          this.mostrarMensaje(`La eliminación de "${pelicula.originalTitle}" ha sido cancelada.`, false); 
          console.log(`Eliminación de ${pelicula.originalTitle} cancelada.`);
        }
      });
    } else {
      this.mostrarMensaje('Error: ID de la película no disponible para eliminar.', true);
      console.error('No se puede eliminar la película porque _id es undefined:', pelicula);
    }
  }


  editarPelicula(pelicula: Pelicula) {
    // Crea una copia de la película para evitar modificar directamente el objeto en la lista
    // y para que los cambios en el formulario no afecten la lista hasta que se guarden.
    this.peliculaAEditar = { ...pelicula };
    console.log('Editando película:', this.peliculaAEditar);
  }

  guardarEdicion() {
    if (this.peliculaAEditar && this.peliculaAEditar._id) {
      this.peliculaService.editPelicula(this.peliculaAEditar).subscribe({
        next: (result) => {
          console.log('Película actualizada exitosamente:', result);
          this.mostrarMensaje('¡Película actualizada con éxito!', false);
          this.mostrarPeliculasBD();
          this.peliculaAEditar = null;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar película:', err);
          if (err.error && err.error.msg) {
            this.mostrarMensaje(`Error al actualizar: ${err.error.msg}`, true);
          } else {
            this.mostrarMensaje('Error inesperado al actualizar la película. Consulte la consola.', true);
          }
        }
      });
    } else {
      this.mostrarMensaje('No hay película seleccionada para editar o falta el ID.', true);
    }
  }


  cancelarEdicion() {
    this.peliculaAEditar = null;
    this.mostrarMensaje('Edición cancelada.', true);
  }

  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    if (esError) {
      console.error('Mensaje de error:', mensaje);
      Swal.fire({
        icon: 'error',
        title: '¡Oops...',
        text: mensaje,
        confirmButtonText: 'Entendido'
      });
    } else {
      console.log('Mensaje de éxito:', mensaje);
      Swal.fire({
        icon: 'success',
        title: '¡Éxito!',
        text: mensaje,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    }
  }

  private mostrarConfirmacion(
    title: string,
    text: string,
    icon: 'warning' | 'question' = 'question'
  ): Promise<boolean> {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar', // Texto más específico para esta acción
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}
