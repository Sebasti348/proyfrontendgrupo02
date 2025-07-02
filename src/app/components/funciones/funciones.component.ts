// funciones.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../services/funciones.service';
import { Funcion } from '../../models/funcion';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-funciones',
  imports: [CommonModule],
  templateUrl: './funciones.component.html',
  styleUrls: ['./funciones.component.css'],
})
export class FuncionesComponent implements OnInit {
  funciones: Funcion[] = [];

  constructor(private http: HttpClient, private funcionService: FuncionesService, private router: Router,private loginservice: LoginService) { }

  ngOnInit(): void {
    this.cargarFunciones();
  }

  cargarFunciones() {
    this.funcionService.getFuncionesActivas().subscribe(
      result => {
        this.funciones = result;
        console.log('Funciones cargadas:', this.funciones);
      },
      error => {
        console.error('Error al cargar funciones:', error);
      }
    );
  }

  reservarPelicula(funcionSeleccionada: string | undefined) {
    if(this.loginservice.userLoggedIn()){
      if (funcionSeleccionada) {
        this.router.navigate(['reservas', funcionSeleccionada]);
      } else {
        console.error('No se seleccionó ninguna función');
      }
    }else{
      this.router.navigate(['loginregister']);
    }
  }

}