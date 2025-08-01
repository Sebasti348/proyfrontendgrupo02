import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

declare var FB: any;
declare var google: any;
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
  emailOrUsername: string = '';
  usuario: Usuario = new Usuario();
  //returnUrl!: "/main";
  msglogin!: string; // mensaje que indica si no paso el loguin
  response!: any;
  isLoading: boolean = false; // Variable para controlar el spinner
  userGoogle: Usuario = new Usuario();
  tokenGoogle: string = '';
  googleUser: boolean = false;

  constructor(
    private ngZone: NgZone,
    private loginservice: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private userservice: UsuarioService,
    private http: HttpClient
  ) { }
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
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: "657767929746-8quhhgu57q2bu7mqdokg8at2lk7k61ra.apps.googleusercontent.com", // Reemplaza con tu Client ID
        callback: this.handleCredentialResponse.bind(this),
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large' } // Opciones del botón
      );
    };
    document.head.appendChild(script);
  }
  /**
  * Maneja la respuesta de credenciales de Google después de un inicio de sesión exitoso.
  * Contiene el token JWT con la información del usuario.
  * @param response El objeto de respuesta de credenciales de Google.
  */
  handleCredentialResponse(response: any) {
    const idToken = response.credential;  // este es el token que envías al backend

    this.http.post('https://proybackendgrupo02.onrender.com/api/usuario/google-login', { idToken })
      .subscribe({
        next: (res: any) => {

          this.googleUser = true;
          if (res.status === '1') {
            const googleUser = res.user;

            // Cargamos los datos del usuario a nuestro modelo
            this.usuario.nombre = googleUser.given_name;
            this.usuario.apellido = googleUser.family_name;
            this.usuario.username = googleUser.name;
            this.usuario.password = googleUser.sub ?? googleUser.jti ?? googleUser.email;
            this.usuario.email = googleUser.email;
            this.usuario.rol = 'cliente';
            this.usuario.estado = true;
            this.tokenGoogle = res.tokenGugul;
            // Validamos si existe
            this.loginservice.validarNuevoUsuario(this.usuario).subscribe((validacion: any) => {
              if (!validacion.existe) {
                // Crear usuario si no existe
                this.userservice.createUsuario(this.usuario).subscribe(() => {

                  this.guardarEnSessionYRedirigir(this.usuario);
                });
              } else {
                // Ya existe, simplemente redirigir

                this.guardarEnSessionYRedirigir(this.usuario);
              }
            });
          } else {
            console.error('Error al hacer login con Google');
          }
        },
        error: (err: any) => console.error('Error al verificar el token:', err)
      });
  }
  /**
  * Decodifica un token JWT para extraer su payload (el JSON con la información).
  */
  private decodeJwtResponse(token: string): any {
    return jwtDecode(token);
  }

  login() {



    this.isLoading = true;
    this.msglogin = '';

    this.loginservice.login(this.emailOrUsername, this.password).subscribe(
      (result) => {
        var user = result;

        if (user.status == 1) {
          setTimeout(() => {
            Swal.fire({
              title: 'Login exitoso',
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            sessionStorage.setItem('user', user.username);
            sessionStorage.setItem('userid', user.userid);
            sessionStorage.setItem('rol', user.rol);
            sessionStorage.setItem('token', user.token);
            this.loginservice.usuarioLogueado = user;
            if(user.rol == 'cliente' || user.rol == 'supervisor' || user.rol == 'administrador' || user.rol == 'root'){
              this.router.navigateByUrl('');
            }else{
              this.router.navigateByUrl('auditor');
            }
            this.isLoading = false;
          }, 1500);
        } else {
          
          this.msglogin = 'Credenciales incorrectas..';
          this.isLoading = false;
        }
      },
      (error) => {
        Swal.fire({
          title: 'Credenciales incorrectas',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
        this.isLoading = false;
      }
    );
  }

  register() {
    this.usuario.estado = true;
    this.usuario.rol = 'cliente';


    if (!this.usuario.email || !this.usuario.password || !this.usuario.nombre) {

      return;
    }

    this.loginservice.validarNuevoUsuario(this.usuario).subscribe(
      (result: any) => {
        this.response = result;

        this.usuario.fechaRegistro = new Date();
        
        if (!this.response.existe) {
          this.userservice.createUsuario(this.usuario).subscribe(
            (result: any) => {

              if (this.usuario.email || this.usuario.username && this.usuario.password) {
                this.emailOrUsername = this.usuario.email ?? this.usuario.username ?? '';
                this.password = this.usuario.password ?? '';
                Swal.fire({
                  title: 'Te has registrado exitosamente',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1500
                });
                this.login();
              }
            },
            (error: any) => {

            }
          );
        } else {

        }
      },
      (error: any) => {
        Swal.fire({
          title: 'Error al registrar usuario',
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });

      }
    );
  }

  private guardarEnSessionYRedirigir(user: any) {
    // First, get the complete user data using the email
    this.userservice.getUsuarioByEmail(user.email).subscribe(
      (completeUser: any) => {
        if (completeUser != null) {
          const fullUserData = completeUser;
          // Store the complete user data in session
          sessionStorage.setItem('user', fullUserData.username);
          sessionStorage.setItem('userid', fullUserData._id); // Use the actual MongoDB ID
          sessionStorage.setItem('rol', fullUserData.rol ?? 'cliente');
          if(this.googleUser){
            sessionStorage.setItem('token', this.tokenGoogle);
          }
          this.ngZone.run(() => this.router.navigateByUrl(''));
        } else {
          console.error('No se encontró el usuario completo');
          this.ngZone.run(() => this.router.navigateByUrl(''));
        }
      },
      (error) => {
        console.error('Error al obtener datos completos del usuario:', error);
        this.ngZone.run(() => this.router.navigateByUrl('/loginregister'));
      }
    );
  }
}