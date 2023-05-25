import { Component } from '@angular/core';
import { ServicioAuthService } from '../../login/servicios/servicio-auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-custom-navbar',
  templateUrl: './custom-navbar.component.html',
  styleUrls: ['./custom-navbar.component.css'],
})
export class CustomNavbarComponent {
  private readonly TOKEN_KEY = 'token';
  userRole: string = "";
  isLoggedIn: boolean = false;
  constructor(public authService: ServicioAuthService, private coockieService: CookieService, private router:Router){
    this.authService.userRole$.subscribe(role => {
      this.userRole = role;
    });
    this.authService.isLogedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;
    });
  }
  
  CerrarSesion(){
    this.coockieService.delete(this.TOKEN_KEY);
    this.userRole = "";
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }

}
