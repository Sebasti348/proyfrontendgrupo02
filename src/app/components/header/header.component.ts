import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterModule,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public loginservice: LoginService, private router: Router){}
  
  logout(){
    this.loginservice.logout();
    // Redirigir al usuario a la página de login después de cerrar sesión
    this.router.navigateByUrl('');
  }
}
