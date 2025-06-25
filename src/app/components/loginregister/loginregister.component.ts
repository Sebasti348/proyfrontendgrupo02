import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
declare var FB: any;
@Component({
  selector: 'app-loginregister',
  imports: [CommonModule],
  templateUrl: './loginregister.component.html',
  styleUrl: './loginregister.component.css'
})
export class LoginregisterComponent implements OnInit {
  userLoggedIn: boolean = false;
  userName: string = '';
  constructor(private ngZone: NgZone) { }
  ngOnInit(): void {
    // Carga el script de Google GSI (Google Sign-In)
    this.loadGoogleScript();
      // 'bind(this)' asegura que 'this' dentro de handleCredentialResponse se refiera al componente.
      (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  // Asegurarse de que el SDK de Facebook esté cargado. Esto es importante si
  // el componente se carga dinámicamente o después de la carga inicial del SDK
  (window as any).fbAsyncInit = () => {
    FB.init({
      appId: '724842419960269', // ¡Reemplaza con tu App ID!
      xfbml: true,
      version: 'v20.0' // Asegúrate de que coincida con el de index.html
    });
    this.checkLoginStatus(); // Verificar el estado de login al iniciar
  };
  // Si el SDK ya está cargado (por ejemplo, al navegar entre rutas), llamamos directamente
  if (typeof FB !== 'undefined') {
    this.checkLoginStatus();
  }

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
// Verificar el estado de login actual
checkLoginStatus() {
  FB.getLoginStatus((response: any) => {
    this.ngZone.run(() => { // Ejecutar dentro de la zona de Angular para actualizar la vista
      if (response.status === 'connected') {
        console.log('Usuario conectado:', response.authResponse);
        this.userLoggedIn = true;
        this.fetchUserData();
      } else {
        console.log('Usuario no conectado.');
        this.userLoggedIn = false;
        this.userName = '';
      }
    });
  });
}
// Iniciar el proceso de login
loginWithFacebook() {
  FB.login((response: any) => {
    this.ngZone.run(() => { // Ejecutar dentro de la zona de Angular para actualizar la vista
      if (response.authResponse) {
        console.log('Login exitoso:', response.authResponse);
        this.userLoggedIn = true;
        this.fetchUserData();
      } else {
        console.log('Login cancelado o fallido.');
        this.userLoggedIn = false;
        this.userName = '';
      }
    });
  }, { scope: 'public_profile,email' }); // Permisos que solicitas
}
// Obtener los datos del usuario (nombre y email, si se concedió permiso)
fetchUserData() {
  FB.api('/me?fields=name,email', (response: any) => {
    this.ngZone.run(() => {
      if (response && !response.error) {
        this.userName = response.name;
        console.log('Datos del usuario:', response);
        // Aquí puedes enviar los datos del usuario a tu backend
      } else {
        console.error('Error al obtener datos del usuario:', response.error);
      }
    });
  });
}
// Cerrar sesión
logoutFromFacebook() {
  FB.logout((response: any) => {
    this.ngZone.run(() => {
      console.log('Sesión cerrada:', response);
      this.userLoggedIn = false;
      this.userName = '';
    });
  });
}
}
