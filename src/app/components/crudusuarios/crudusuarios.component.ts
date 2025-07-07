
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
@Component({
  standalone: true,
  selector: 'app-crudusuarios',
  imports: [ FormsModule, CommonModule, HttpClientModule, SweetAlert2Module],
  templateUrl: './crudusuarios.component.html',
  styleUrl: './crudusuarios.component.css'
})
export class CrudusuariosComponent {

  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  idEditando: number | null = null;
  modo: boolean = false;
  filtro = {
    nombre: '',
    email: '',
    rol: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  agregarUsuario() {
    this.usuario.estado = true;
    if (this.modo == false) {
      this.usuarioService.createUsuario(this.usuario).subscribe(
        (result: any) => {
          Swal.fire({
            title: 'Usuario creado exitosamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerUsuarios();
          this.usuario = new Usuario();
          this.modo = false;
        },
        (error: any) => {
          console.log(error);
        }
      );
      this.obtenerUsuarios();
    } else {
      this.usuarioService.updateUsuario(this.usuario._id, this.usuario).subscribe(
        (result: any) => {
          Swal.fire({
            title: 'Usuario actualizado exitosamente',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          this.obtenerUsuarios();
          this.usuario = new Usuario();
          this.modo = false;
        }
      );
    }
  }


  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (result: any) => {
        this.usuarios = result;
        this.usuariosFiltrados = [...this.usuarios];
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  filtrarUsuarios() {
    if (!this.filtro.nombre && !this.filtro.email && !this.filtro.rol) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const matchesNombre = !this.filtro.nombre || usuario.nombre?.toLowerCase().includes(this.filtro.nombre.toLowerCase());
      const matchesEmail = !this.filtro.email || usuario.email?.toLowerCase().includes(this.filtro.email.toLowerCase());
      const matchesRol = !this.filtro.rol || usuario.rol === this.filtro.rol;
      return matchesNombre && matchesEmail && matchesRol;
    });
  }

  editarUsuario(usuario: Usuario) {
    this.modo = true;
    this.usuario = { ...usuario };
    this.idEditando = usuario._id;
  }

  abrirModal() {
    this.modo = true;
    this.usuario = new Usuario();
    this.idEditando = null;

    // Desplazarse suavemente hasta el formulario
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  eliminarUsuario(id: number) {
    const usuarioEliminar = this.usuarios.find(u => u._id === id);
    if (usuarioEliminar) {
      this.usuarioService.deleteUsuario(usuarioEliminar._id, usuarioEliminar).subscribe(
        (result: any) => {
          this.obtenerUsuarios();
        }
      );
      this.obtenerUsuarios();
    } else {
      console.log("Error Usuario Vacio");
    }

  }

}
