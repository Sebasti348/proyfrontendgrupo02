import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
declare var FB: any;
@Component({
  selector: 'app-loginregister',
  imports: [CommonModule, FormsModule],
  templateUrl: './loginregister.component.html',
  styleUrl: './loginregister.component.css'
})
export class LoginregisterComponent implements OnInit {
  userLoggedIn: boolean = false;
  userName: string = '';
  email: string = '';
  password: string = '';
  usuario : Usuario = new Usuario();
  //returnUrl!: "/main";
  msglogin!: string; // mensaje que indica si no paso el loguin
  response! : any ;
  isLoading: boolean = false; // Variable para controlar el spinner
  constructor(private ngZone: NgZone,private loginservice: LoginService,private route: ActivatedRoute,private router: Router, private userservice : UsuarioService) { }
  ngOnInit(): void {
    // Carga el script de Google GSI (Google Sign-In)
    this.loadGoogleScript();
      // 'bind(this)' asegura que 'this' dentro de handleCredentialResponse se refiera al componente.
      (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);

}
    private loadGoogleScript(): void {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}
/**
* Maneja la respuesta de credenciales de Google después de un inicio de sesión exitoso.
* Contiene el token JWT con la información del usuario.
* @param response El objeto de respuesta de credenciales de Google.
*/
handleCredentialResponse(response: any): void {
  // 'ngZone.run' asegura que los cambios y actualizaciones de Angular se detecten.
  this.ngZone.run(() => {
    console.log('Token JWT ID codificado:', response.credential);
    // Decodifica el token JWT para obtener la información del usuario.
    const decodedToken = this.decodeJwtResponse(response.credential);
    console.log('Información de usuario decodificada (JSON):', decodedToken);
    // Ejemplo de cómo acceder a la información:
    alert('¡Bienvenido, ' + (decodedToken.name || decodedToken.email) + '!');
  });
}
    /**
    * Decodifica un token JWT para extraer su payload (el JSON con la información).
    */
  private decodeJwtResponse(token: string): any {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}


login(){
  console.log('Email:', this.email);
  console.log('Contraseña:', this.password);
  
  // Mostrar spinner
  this.isLoading = true;
  this.msglogin = '';
  
  this.loginservice.login(this.email, this.password)
 .subscribe(
 (result) => {
 var user = result;
 console.log('Respuesta completa del backend:', user); // Para depuración
 console.log('Rol del usuario:', user.rol); // Para depuración
 if (user.status == 1){
   // Pausa de 1.5 segundos para mostrar el spinner
   setTimeout(() => {
     //guardamos el user en cookies en el cliente
     sessionStorage.setItem("user", user.username);
     sessionStorage.setItem("userid", user.userid);
     sessionStorage.setItem("rol", user.rol);
     console.log('Rol guardado en sessionStorage:', sessionStorage.getItem('rol')); // Para depuración
     
     // Verificación adicional: si el rol no existe, intentar con diferentes nombres
     if (!user.rol) {
       console.log('Rol no encontrado en user.rol, buscando alternativas...');
       if (user.role) {
         sessionStorage.setItem("rol", user.role);
         console.log('Rol encontrado en user.role:', user.role);
       } else if (user.tipo) {
         sessionStorage.setItem("rol", user.tipo);
         console.log('Rol encontrado en user.tipo:', user.tipo);
       } else {
         console.log('No se encontró el rol en ninguna propiedad conocida');
         console.log('Propiedades disponibles en user:', Object.keys(user));
       }
     }
     
     //redirigimos a home o a pagina que llamo
     this.router.navigateByUrl("/");
     this.isLoading = false; // Ocultar spinner
   }, 1500);
 } else {
   //usuario no encontrado muestro mensaje en la vista
   this.msglogin="Credenciales incorrectas..";
   this.isLoading = false; // Ocultar spinner
 }
 },
 error => {
   alert("Error de conexion");
   console.log("error en conexion");
   console.log(error);
   this.isLoading = false; // Ocultar spinner
 });
  // Aquí puedes agregar la lógica para enviar al backend
}
register(){
  this.usuario.estado = true;
  this.usuario.rol = "cliente";
  console.log(this.usuario)
  
  // Validar que el usuario tenga los datos necesarios
  if (!this.usuario.email || !this.usuario.password || !this.usuario.nombre) {
    console.log("Faltan datos requeridos para el registro");
    return;
  }
  
  this.loginservice.validarNuevoUsuario(this.usuario).subscribe(
    (result : any)=>{
        this.response = result;
        console.log(result);
        
        // Mover la lógica aquí dentro del callback
        if (!this.response.existe){
          // El usuario no existe, proceder a crearlo
          this.userservice.createUsuario(this.usuario).subscribe(
            (result:any)=>{
              console.log("Usuario creado exitosamente:", result);
              // Después de crear el usuario, hacer login automático
              if (this.usuario.email && this.usuario.password) {
                this.email = this.usuario.email; // Asignar el email como username
                this.password = this.usuario.password; // Asignar la contraseña
                this.login(); // Llamar al método login
              }
            },
            (error:any)=>{
              console.log("Error al crear usuario:", error);
              // Aquí podrías mostrar un mensaje de error
            }
          );
        } else {
          // El usuario ya existe
          console.log("Correo electrónico ya registrado");
          // Aquí podrías mostrar un mensaje al usuario
        }
    },
    (error:any)=>{
      console.log("Error al validar usuario:", error);
      // Aquí podrías mostrar un mensaje de error
    }
  );
}
}
