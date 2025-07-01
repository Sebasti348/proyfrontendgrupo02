import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Funcion } from '../../models/funcion';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from '../../models/pelicula';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-gestion-funciones',
  standalone: true, // Agregado si no estaba ya
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-funciones.component.html',
  styleUrl: './gestion-funciones.component.css'
})
export class GestionFuncionesComponent implements OnInit {
  nuevaFuncion: Funcion = new Funcion();
  peliculas: Pelicula[] = [];
  horariosDisponibles: string[] = [
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  salasDisponibles: string[] = [
    'Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'
  ];

  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedSingleDate: string = '';
  isSingleFunctionMode: boolean = true;

  constructor(private peliculasService: PeliculasService, private funcionService: FuncionesService) { }

  ngOnInit(): void {
    this.obtenerPeliculas();
  }

  obtenerPeliculas() {
    this.peliculasService.getPeliculas().subscribe(
      result => {
        // Simplificación: Mapea directamente a nuevas instancias de Pelicula si el constructor lo permite
        this.peliculas = result.map((item: any) => new Pelicula(item));
        console.log('Películas obtenidas de la BD:', this.peliculas); // Comentado para producción
      },
      error => {
        console.error('Error al obtener películas de la BD:', error);
        this.mostrarMensaje('Error al cargar las películas.', true); // Mejorado el mensaje
      }
    );
  }

  toggleFunctionMode(isSingle: boolean) {
    this.isSingleFunctionMode = isSingle;
    this.limpiarFormularioFechas();
  }

  crearFuncion() {
    if (!this.nuevaFuncion.pelicula || !this.nuevaFuncion.hora || !this.nuevaFuncion.sala) {
      this.mostrarMensaje('Por favor, complete los campos de película, hora y sala.', true);
      return;
    }

    const funcionesACrear: Funcion[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (this.isSingleFunctionMode) {
      if (!this.selectedSingleDate) {
        this.mostrarMensaje('Por favor, seleccione una fecha para la función única.', true);
        return;
      }

      const singleDate = new Date(this.selectedSingleDate);
      singleDate.setHours(0, 0, 0, 0);

      if (singleDate < today) {
        this.mostrarMensaje('La fecha de la función no puede ser anterior a la fecha actual.', true);
        return;
      }

      funcionesACrear.push(this.prepararFuncion(singleDate));

    } else {
      if (!this.selectedStartDate || !this.selectedEndDate) {
        this.mostrarMensaje('Por favor, complete el rango de fechas para las funciones semanales.', true);
        return;
      }

      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (startDate < today) {
        this.mostrarMensaje('La fecha de inicio no puede ser anterior a la fecha actual.', true);
        return;
      }
      if (startDate > endDate) {
        this.mostrarMensaje('La fecha de inicio no puede ser posterior a la fecha de fin.', true);
        return;
      }

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        funcionesACrear.push(this.prepararFuncion(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Enviar las funciones preparadas a la API
    funcionesACrear.forEach(funcion => {
      // console.log('Intentando crear función para:', funcion.fecha.toISOString().split('T')[0]); // Comentado para producción
      this.funcionService.postFuncion(funcion).subscribe(
        response => {
          // console.log('Función creada exitosamente:', response); // Comentado para producción
          this.mostrarMensaje(`Función para ${new Date(funcion.fecha!).toLocaleDateString()} a las ${funcion.hora} en ${funcion.sala} creada.`, false); // Asegurado que fecha no es null
        },
        error => {
          console.error('Error al crear la función:', error);
          if (error.error && error.error.msg) {
            this.mostrarMensaje(`Error: ${error.error.msg}`, true);
          } else {
            this.mostrarMensaje('Error al crear una función. Consulte la consola para más detalles.', true);
          }
        }
      );
    });

    this.limpiarFormularioCompleto();
  }

  private prepararFuncion(date: Date): Funcion {
    const funcion = new Funcion();
    funcion.pelicula = this.nuevaFuncion.pelicula;
    funcion.hora = this.nuevaFuncion.hora;
    funcion.sala = this.nuevaFuncion.sala;
    funcion.butacasOcupadas = [];
    funcion.fecha = date;
    return funcion;
  }

  limpiarFormularioFechas() {
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.selectedSingleDate = '';
  }

  limpiarFormularioCompleto() {
    this.nuevaFuncion = new Funcion();
    this.nuevaFuncion.pelicula = new Pelicula();
    this.nuevaFuncion.hora = '';
    this.nuevaFuncion.sala = '';
    this.limpiarFormularioFechas();
  }

  // Método para mostrar mensajes más personalizables (reemplazo de alert)
  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    // Aquí puedes integrar un servicio de notificaciones (ej: MatSnackBar, Toastr, etc.)
    // Por ahora, usamos console.log y alert como un ejemplo
    if (esError) {
      console.error('Mensaje de error:', mensaje);
      alert('Error: ' + mensaje); // Mantener por simplicidad, pero idealmente reemplazar
    } else {
      console.log('Mensaje de éxito:', mensaje);
      alert(mensaje); // Mantener por simplicidad, pero idealmente reemplazar
    }
  }
}