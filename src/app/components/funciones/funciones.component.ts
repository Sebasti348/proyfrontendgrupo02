import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoginService } from '../../services/login.service';


@Component({
  selector: 'app-funciones',
  imports: [CommonModule, FormsModule],
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.css'],
})

export class FuncionesComponent implements OnInit {
  nombrePelicula: string | null = null;
  funciones: Funcion[] = [];
  filterNombrePelicula: string = '';
  filterFecha: string = '';
  mostrarFiltros: boolean = false;
  filtroSeleccionado: 'nombre' | 'fecha' = 'nombre';
  mensajeNoFunciones: string = '';

  constructor(
    private http: HttpClient,
    private funcionService: FuncionesService,
    private router: Router,
    private route: ActivatedRoute,
    private loginservice: LoginService
  ) { }

  ngOnInit(): void {
    // Se suscribe a los cambios en los parámetros de la URL
    this.route.paramMap.subscribe(params => {
      // Obtiene el parámetro 'nombrePelicula' de la URL
      this.nombrePelicula = params.get('nombrePelicula');
      // Verifica si se recibió un nombre de película
      if (this.nombrePelicula) {
        this.filterNombrePelicula = this.nombrePelicula; // Pre-rellena el filtro por nombre
        this.filtroSeleccionado = 'nombre'; // Establece el filtro activo a 'nombre'
        this.mostrarFiltros = true;
        this.aplicarFiltros();
      } else {
        console.log('No se recibió el nombre de la película de la ruta. Cargando todas las funciones activas.');
        this.cargarFuncionesActivas(); // Si no hay nombre de película, carga todas las funciones activas
      }
    });
  }

  aplicarFiltros(): void {
    this.mensajeNoFunciones = ''; // Limpia cualquier mensaje anterior de "no funciones"
    if (this.filtroSeleccionado === 'nombre') {
      if (this.filterNombrePelicula.trim() !== '') {
        this.cargarFuncionesPorNombre(this.filterNombrePelicula);
      } else {
        console.log('No se ingresó nombre de película. Cargando todas las funciones activas.');
        this.cargarFuncionesActivas();
      }
    } else if (this.filtroSeleccionado === 'fecha') {
      if (this.filterFecha.trim() !== '') {
        this.cargarFuncionesPorFecha(this.filterFecha);
      } else {
        console.log('No se ingresó fecha. Cargando todas las funciones activas.');
        this.cargarFuncionesActivas();
      }
    } else {
      console.log('No se seleccionó tipo de filtro. Cargando todas las funciones activas.');
      this.cargarFuncionesActivas();
    }
  }

  // Método para cargar funciones filtradas por nombre de película
  cargarFuncionesPorNombre(nombre: string): void {
    this.funcionService.getFuncionByName(nombre).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.mensajeNoFunciones = `No se encontraron funciones para la película "${nombre}".`;
          return of([]);
        } else {
          console.error('Error al cargar funciones por nombre:', error);
          this.mensajeNoFunciones = 'Ocurrió un error al buscar funciones por nombre.';
          return of([]);
        }
      })
    ).subscribe({
      next: (data) => {
        this.funciones = data;
        if (this.funciones.length === 0 && !this.mensajeNoFunciones) {
          this.mensajeNoFunciones = `No se encontraron funciones para la película "${nombre}".`;
        }
        console.log('Funciones cargadas por nombre:', this.funciones);
      },
      error: (error) => {
        console.error('Error no manejado en suscripción de funciones por nombre:', error);
        this.funciones = [];
        this.mensajeNoFunciones = 'Ocurrió un error inesperado al cargar las funciones.';
      }
    });
  }

  cargarFuncionesPorFecha(fecha: string): void {
    this.funcionService.getFuncionByDate(fecha).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.mensajeNoFunciones = `No se encontraron funciones para la fecha ${fecha}.`;
          return of([]);
        } else {
          console.error('Error al cargar funciones por fecha:', error);
          this.mensajeNoFunciones = 'Ocurrió un error al buscar funciones por fecha.';
          return of([]);
        }
      })
    ).subscribe({
      next: (data) => {
        this.funciones = data;
        if (this.funciones.length === 0 && !this.mensajeNoFunciones) {
          this.mensajeNoFunciones = `No se encontraron funciones para la fecha ${fecha}.`;
        }
        console.log('Funciones cargadas por fecha:', this.funciones);
      },
      error: (error) => {
        console.error('Error no manejado en suscripción de funciones por fecha:', error);
        this.funciones = [];
        this.mensajeNoFunciones = 'Ocurrió un error inesperado al cargar las funciones.';
      }
    });
  }

  cargarFuncionesActivas(): void {
    this.funcionService.getFuncionesActivas().pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al cargar todas las funciones activas:', error);
        this.mensajeNoFunciones = 'Ocurrió un error al cargar las funciones activas.';
        return of([]);
      })
    ).subscribe({
      next: (data) => {
        this.funciones = data;
        if (this.funciones.length === 0) {
          this.mensajeNoFunciones = 'No hay funciones activas disponibles en este momento.';
        }
        console.log('Todas las funciones activas cargadas:', this.funciones);
      },
      error: (error) => {
        console.error('Error no manejado en suscripción de funciones activas:', error);
        this.funciones = [];
        this.mensajeNoFunciones = 'Ocurrió un error inesperado al cargar las funciones activas.';
      }
    });
  }

  // Método para limpiar los campos de filtro y recargar todas las funciones
  limpiarFiltros(): void {
    this.filterNombrePelicula = ''; // Limpia el filtro por nombre
    this.filterFecha = ''; // Limpia el filtro por fecha
    this.mensajeNoFunciones = ''; // Limpia el mensaje de "no funciones"
    this.cargarFuncionesActivas(); // Vuelve a cargar todas las funciones activas
  }

  reservarPelicula(funcionSeleccionada: string | undefined) {
    if (funcionSeleccionada && this.loginservice.userLoggedIn()) {
      this.router.navigate(['reservas', funcionSeleccionada]);
    } else {
      console.error('No se seleccionó ninguna función para reservar.');
      this.router.navigate(['loginregister']);
    }
  }
}