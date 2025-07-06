import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Funcion } from '../../models/funcion';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from '../../models/pelicula';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-gestion-funciones',
  imports: [FormsModule, CommonModule],
  templateUrl: './gestion-funciones.component.html',
  styleUrl: './gestion-funciones.component.css'
})
export class GestionFuncionesComponent implements OnInit {
  // Propiedades del componente
  nuevaFuncion: Funcion = new Funcion();
  peliculas: Pelicula[] = [];
  funcionesActivas: Funcion[] = [];
  horariosDisponibles: string[] = [
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];
  salasDisponibles: string[] = [
    'Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'
  ];

  selectedStartDate: string = ''; // Modelo para la fecha de inicio en el modo de rango
  selectedEndDate: string = ''; // Modelo para la fecha de fin en el modo de rango
  selectedSingleDate: string = ''; // Modelo para la fecha en el modo de función única
  isSingleFunctionMode: boolean = true; // Booleano para alternar entre modo de función única y rango semanal

  constructor(private peliculasService: PeliculasService, private funcionService: FuncionesService) { }

  ngOnInit(): void {
    this.obtenerPeliculas();
    this.cargarFuncionesActivas();
  }

  obtenerPeliculas() {
    this.peliculasService.getPeliculas().subscribe(
      result => {
        // Mapea los resultados a instancias de Pelicula 
        this.peliculas = result.map((item: any) => new Pelicula(item));
        console.log('Películas obtenidas de la BD:', this.peliculas);
      },
      error => {
        console.error('Error al obtener películas de la BD:', error);
        this.mostrarMensaje('Error al cargar las películas.', true);
      }
    );
  }

  // Método para alternar entre el modo de función única y el modo de rango semanal
  toggleFunctionMode(isSingle: boolean) {
    this.isSingleFunctionMode = isSingle;
    this.limpiarFormularioFechas();
  }

  // Método para crear una o varias funciones
  crearFuncion() {
    // Validación básica de campos obligatorios
    if (!this.nuevaFuncion.pelicula || !this.nuevaFuncion.hora || !this.nuevaFuncion.sala) {
      this.mostrarMensaje('Por favor, complete los campos de película, hora y sala.', true);
      return; // Sale de la función si faltan campos
    }

    const funcionesACrear: Funcion[] = []; // Array para almacenar las funciones a enviar a la API
    const today = new Date(); // Obtiene la fecha actual
    today.setHours(0, 0, 0, 0); // Normaliza la fecha actual a medianoche para comparación

    // Lógica para crear función única
    if (this.isSingleFunctionMode) {
      if (!this.selectedSingleDate) {
        this.mostrarMensaje('Por favor, seleccione una fecha para la función única.', true);
        return; // Sale si no se seleccionó fecha única
      }
      // Parsea la fecha seleccionada del input (formato 'YYYY-MM-DD')
      const [year, month, day] = this.selectedSingleDate.split('-').map(Number);
      const singleDate = new Date(year, month - 1, day); // Crea un objeto Date (mes es 0-indexado)

      singleDate.setHours(0, 0, 0, 0); // Normaliza la fecha seleccionada a medianoche

      // Validación: la fecha de la función no puede ser anterior a la fecha actual
      if (singleDate < today) {
        this.mostrarMensaje('La fecha de la función no puede ser anterior a la fecha actual.', true);
        return;
      }

      funcionesACrear.push(this.prepararFuncion(singleDate)); // Prepara la función y la añade al array
      this.cargarFuncionesActivas() // Recarga las funciones activas

    } else { // Lógica para crear funciones en un rango semanal
      if (!this.selectedStartDate || !this.selectedEndDate) {
        this.mostrarMensaje('Por favor, complete el rango de fechas para las funciones semanales.', true);
        return;
      }

      // Parsear las fechas como locales para evitar problemas de zona horaria
      const [startYear, startMonth, startDay] = this.selectedStartDate.split('-').map(Number);
      const startDate = new Date(startYear, startMonth - 1, startDay);

      const [endYear, endMonth, endDay] = this.selectedEndDate.split('-').map(Number);
      const endDate = new Date(endYear, endMonth - 1, endDay);

      startDate.setHours(0, 0, 0, 0); // Normaliza la fecha de inicio a medianoche
      endDate.setHours(0, 0, 0, 0);   // Normaliza la fecha de fin a medianoche

      // Validación: la fecha de inicio no puede ser anterior a la fecha actual
      if (startDate < today) {
        this.mostrarMensaje('La fecha de inicio no puede ser anterior a la fecha actual.', true);
        return;
      }
      // Validación: la fecha de inicio no puede ser posterior a la fecha de fin
      if (startDate > endDate) {
        this.mostrarMensaje('La fecha de inicio no puede ser posterior a la fecha de fin.', true);
        return;
      }

      let currentDate = new Date(startDate); // Inicia un iterador de fecha desde la fecha de inicio
      // Itera desde la fecha de inicio hasta la fecha de fin (inclusive)
      while (currentDate <= endDate) {
        funcionesACrear.push(this.prepararFuncion(new Date(currentDate))); // Prepara y añade la función para la fecha actual
        currentDate.setDate(currentDate.getDate() + 1); // Avanza al siguiente día
      }
    }

    funcionesACrear.forEach(funcion => {
      this.funcionService.postFuncion(funcion).subscribe(
        response => {
          // Muestra un mensaje de éxito con los detalles de la función creada
          this.mostrarMensaje(`Función para ${new Date(funcion.fecha!).toLocaleDateString()} a las ${funcion.hora} en ${funcion.sala} creada.`, false);
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
      this.cargarFuncionesActivas(); // Refresca la tabla de funciones activas después de cada creación
    });

    this.limpiarFormularioCompleto(); // Limpia el formulario después de enviar
    this.cargarFuncionesActivas() // Recarga las funciones activas (para asegurar que la tabla esté actualizada)
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

  private mostrarMensaje(mensaje: string, esError: boolean = false) {
    if (esError) {
      console.error('Mensaje de error:', mensaje);
      alert('Error: ' + mensaje);
    } else {
      console.log('Mensaje de éxito:', mensaje);
      alert(mensaje);
    }
  }

  cargarFuncionesActivas() {
    this.funcionService.getFuncionesActivas().subscribe(
      funciones => {
        this.funcionesActivas = funciones;
        console.log('Funciones activas:', this.funcionesActivas);
      },
      error => {
        console.error('Error al cargar funciones activas:', error);
        this.mostrarMensaje('Error al obtener funciones activas.', true);
      }
    );
  }

  // Método para eliminar una función por su ID
  eliminarFuncion(id: string | undefined) {
    if (!id) {
      this.mostrarMensaje('ID inválido. No se puede eliminar esta función.', true);
      return; // Sale si el ID es inválido
    }

    // Pide confirmación al usuario antes de eliminar
    if (confirm('¿Estás seguro de que querés eliminar esta función?')) { // Considerar reemplazar con un modal personalizado
      this.funcionService.deleteFuncion(id).subscribe(
        res => {
          this.mostrarMensaje('Función eliminada correctamente.');
          this.cargarFuncionesActivas();
        },
        error => {
          console.error('Error al eliminar función:', error);
          this.mostrarMensaje('No se pudo eliminar la función.', true);
        }
      );
    }
  }
}
