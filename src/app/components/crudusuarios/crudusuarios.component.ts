
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  standalone: true,
  selector: 'app-crudusuarios',
  imports: [ FormsModule, CommonModule, HttpClientModule],
  templateUrl: './crudusuarios.component.html',
  styleUrl: './crudusuarios.component.css'
})
export class CrudusuariosComponent {

  usuario: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  idEditando: number | null = null;
  modo : boolean = false ;
  usuarioEliminar: Usuario = new Usuario();
  emailFiltrar: string = '';
  rolFiltrar: string = '';
  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  agregarUsuario() {
    this.usuario.estado= true;
    if (this.modo == false){
      this.usuarioService.createUsuario(this.usuario).subscribe(
        (result: any) => {
          this.obtenerUsuarios();
          this.usuario = new Usuario();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
    else{
      this.usuarioService.updateUsuario(this.usuario._id,this.usuario).subscribe(
        (result: any)=>{
          this.obtenerUsuarios();
          this.usuario = new Usuario();
          this.modo = false;
        }
      )
    }
    
  }
  obtenerUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      (result: any) => {
        this.usuarios = result;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  filtrarUsuario(){
    if(this.emailFiltrar == ''){
      this.obtenerUsuarios();
    }
    else{
      this.usuarioService.getUsuarioByEmail(this.emailFiltrar).subscribe(
        (result: any) => {
          this.usuarios = result;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  filtrarUsuarioRol(){
    if(this.rolFiltrar == ''){
      this.obtenerUsuarios();
    }
    else{
      this.usuarioService.getUsuariosByRole(this.rolFiltrar).subscribe(
        (result: any) => {
          this.usuarios = result;
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
  

  editarUsuario(id : number) {
    
    const usuarioEditar = this.usuarios.find(u => u._id === id);
    if (usuarioEditar) {
      this.modo = true;
      this.usuario = { ...usuarioEditar };
      this.idEditando = id;
    }
    
  }

  eliminarUsuario(id: number) {
    const usuarioEliminar = this.usuarios.find(u => u._id === id);
    //console.log(this.usuarioEliminar);
    if (usuarioEliminar){
      this.usuarioService.deleteUsuario(usuarioEliminar._id , usuarioEliminar).subscribe(
        (result: any ) =>{
          this.obtenerUsuarios();
        }
      )
    }
    else{
      console.log("Error Usuario Vacio")
    }
  }
}
